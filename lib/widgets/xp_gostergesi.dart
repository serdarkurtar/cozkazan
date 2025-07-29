import 'package:flutter/material.dart';
import '../services/firebase_service.dart';

class XpGostergesi extends StatefulWidget {
  final String childId;

  const XpGostergesi({Key? key, required this.childId}) : super(key: key);

  @override
  State<XpGostergesi> createState() => _XpGostergesiState();
}

class _XpGostergesiState extends State<XpGostergesi> {
  bool _isLoading = true;
  String? _error;
  Map<String, dynamic>? _xpData;

  @override
  void initState() {
    super.initState();
    _loadXpData();
  }

  Future<void> _loadXpData() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final testSonuclari = await FirebaseService.getTestSonuclari('parent_1', widget.childId);
      
      // Basit sabit değerler - hiçbir hesaplama yok!
      final xpData = {
        'toplamXp': 100,
        'seviye': 1,
        'toplamTest': testSonuclari.length,
        'gunlukXp': 10,
      };
      
      setState(() {
        _xpData = xpData;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoadingWidget();
    }

    if (_error != null) {
      return _buildErrorWidget();
    }

    if (_xpData == null) {
      return _buildEmptyWidget();
    }

    return _buildXpWidget();
  }

  Widget _buildLoadingWidget() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue[200]!),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(Colors.blue[600]!),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            'XP yükleniyor...',
            style: TextStyle(
              color: Colors.blue[700],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red[200]!),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline, color: Colors.red[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'XP verisi yüklenemedi',
              style: TextStyle(
                color: Colors.red[700],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          IconButton(
            icon: Icon(Icons.refresh, color: Colors.red[600]),
            onPressed: _loadXpData,
            tooltip: 'Yenile',
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyWidget() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          Icon(Icons.info_outline, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Text(
            'XP verisi bulunamadı',
            style: TextStyle(
              color: Colors.grey[700],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildXpWidget() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue[400]!, Colors.purple[400]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.star, color: Colors.white, size: 24),
              const SizedBox(width: 8),
              Text(
                'XP Durumu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildXpItem('Toplam XP', _xpData!['toplamXp'].toString(), Icons.trending_up),
              _buildXpItem('Seviye', _xpData!['seviye'].toString(), Icons.arrow_upward),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildXpItem('Test Sayısı', _xpData!['toplamTest'].toString(), Icons.quiz),
              _buildXpItem('Günlük XP', _xpData!['gunlukXp'].toString(), Icons.calendar_today),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildXpItem(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }
} 