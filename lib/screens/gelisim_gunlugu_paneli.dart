import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class GelisimGunluguPaneli extends StatefulWidget {
  const GelisimGunluguPaneli({super.key});

  @override
  State<GelisimGunluguPaneli> createState() => _GelisimGunluguPaneliState();
}

class _GelisimGunluguPaneliState extends State<GelisimGunluguPaneli> {
  // Test verileri (gerçek uygulamada API'den gelecek)
  final List<Map<String, dynamic>> _haftalikVeriler = [
    {'gun': 'Pzt', 'xp': 45, 'kitap': 20, 'test': 3},
    {'gun': 'Sal', 'xp': 60, 'kitap': 30, 'test': 4},
    {'gun': 'Çar', 'xp': 35, 'kitap': 15, 'test': 2},
    {'gun': 'Per', 'xp': 80, 'kitap': 45, 'test': 5},
    {'gun': 'Cum', 'xp': 55, 'kitap': 25, 'test': 3},
    {'gun': 'Cmt', 'xp': 70, 'kitap': 40, 'test': 4},
    {'gun': 'Paz', 'xp': 40, 'kitap': 20, 'test': 2},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("📊 Gelişim Günlüğü"),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Özet kartları
            _buildOzetKartlari(),
            const SizedBox(height: 24),
            
            // XP Grafiği
            _buildXpGrafigi(),
            const SizedBox(height: 24),
            
            // Kitap Okuma Grafiği
            _buildKitapGrafigi(),
            const SizedBox(height: 24),
            
            // Test Sayısı Grafiği
            _buildTestGrafigi(),
            const SizedBox(height: 24),
            
            // Günlük detay tablosu
            _buildGunlukDetay(),
          ],
        ),
      ),
    );
  }

  Widget _buildOzetKartlari() {
    final toplamXp = _haftalikVeriler.fold(0, (sum, item) => sum + (item['xp'] as int));
    final toplamKitap = _haftalikVeriler.fold(0, (sum, item) => sum + (item['kitap'] as int));
    final toplamTest = _haftalikVeriler.fold(0, (sum, item) => sum + (item['test'] as int));
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Bu Hafta Özeti',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildOzetKart(
                'Toplam XP',
                '$toplamXp',
                Icons.trending_up,
                Colors.green,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildOzetKart(
                'Kitap (dk)',
                '$toplamKitap',
                Icons.book,
                Colors.blue,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildOzetKart(
                'Test Sayısı',
                '$toplamTest',
                Icons.quiz,
                Colors.orange,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildOzetKart(String baslik, String deger, IconData icon, Color renk) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: renk, size: 32),
            const SizedBox(height: 8),
            Text(
              deger,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: renk,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              baslik,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildXpGrafigi() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Günlük XP Grafiği',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: 100,
                  barTouchData: BarTouchData(enabled: false),
                  titlesData: FlTitlesData(
                    show: true,
                    rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(_haftalikVeriler[value.toInt()]['gun']);
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(value.toInt().toString());
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  barGroups: _haftalikVeriler.asMap().entries.map((entry) {
                    return BarChartGroupData(
                      x: entry.key,
                      barRods: [
                        BarChartRodData(
                          toY: entry.value['xp'].toDouble(),
                          color: Colors.green,
                          width: 20,
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKitapGrafigi() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Kitap Okuma Süresi (dk)',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(show: true),
                  titlesData: FlTitlesData(
                    show: true,
                    rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(_haftalikVeriler[value.toInt()]['gun']);
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(value.toInt().toString());
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: true),
                  lineBarsData: [
                    LineChartBarData(
                      spots: _haftalikVeriler.asMap().entries.map((entry) {
                        return FlSpot(entry.key.toDouble(), entry.value['kitap'].toDouble());
                      }).toList(),
                      isCurved: true,
                      color: Colors.blue,
                      barWidth: 3,
                      dotData: FlDotData(show: true),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTestGrafigi() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Günlük Test Sayısı',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: 10,
                  barTouchData: BarTouchData(enabled: false),
                  titlesData: FlTitlesData(
                    show: true,
                    rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(_haftalikVeriler[value.toInt()]['gun']);
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(value.toInt().toString());
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  barGroups: _haftalikVeriler.asMap().entries.map((entry) {
                    return BarChartGroupData(
                      x: entry.key,
                      barRods: [
                        BarChartRodData(
                          toY: entry.value['test'].toDouble(),
                          color: Colors.orange,
                          width: 20,
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGunlukDetay() {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Günlük Detaylar',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            ..._haftalikVeriler.map((veri) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Text(
                      veri['gun'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  Expanded(
                    child: Text('${veri['xp']} XP'),
                  ),
                  Expanded(
                    child: Text('${veri['kitap']} dk'),
                  ),
                  Expanded(
                    child: Text('${veri['test']} test'),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
} 