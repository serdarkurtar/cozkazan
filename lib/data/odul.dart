class Odul {
  final String ad;
  final String aciklama;
  final int hedefXp;
  final bool tamamlandi;
  final DateTime? tamamlanmaTarihi;

  Odul({
    required this.ad,
    required this.aciklama,
    required this.hedefXp,
    this.tamamlandi = false,
    this.tamamlanmaTarihi,
  });

  Map<String, dynamic> toJson() => {
        'ad': ad,
        'aciklama': aciklama,
        'hedefXp': hedefXp,
        'tamamlandi': tamamlandi,
        'tamamlanmaTarihi': tamamlanmaTarihi?.toIso8601String(),
      };

  factory Odul.fromJson(Map<String, dynamic> json) => Odul(
        ad: json['ad'] ?? '',
        aciklama: json['aciklama'] ?? '',
        hedefXp: json['hedefXp'] ?? 0,
        tamamlandi: json['tamamlandi'] ?? false,
        tamamlanmaTarihi: json['tamamlanmaTarihi'] != null
            ? DateTime.tryParse(json['tamamlanmaTarihi'])
            : null,
      );
} 