import 'package:flutter/material.dart';
import 'ai_sohbet_cocuk.dart';
import 'ai_sohbet_veli.dart';

class AiMentorScreen extends StatefulWidget {
  const AiMentorScreen({Key? key}) : super(key: key);

  @override
  State<AiMentorScreen> createState() => _AiMentorScreenState();
}

class _AiMentorScreenState extends State<AiMentorScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🧠 Yapay Zekâ Asistanım'),
        backgroundColor: Colors.indigo[600],
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(
              icon: Icon(Icons.child_care),
              text: '👧 Çocuk Mentoru',
            ),
            Tab(
              icon: Icon(Icons.family_restroom),
              text: '👨‍👩‍👧 Veli Danışmanı',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          AiSohbetCocuk(),
          AiSohbetVeli(),
        ],
      ),
    );
  }
} 