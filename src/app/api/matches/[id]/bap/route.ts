import { NextResponse } from 'next/server';
import { query, queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await context.params;

    // 1. Ambil data pertandingan
    const match = queryOne<any>(
      `SELECT 
        m.*,
        ht.name as home_team_name, ht.school_name as home_school, ht.logo_url as home_logo,
        at.name as away_team_name, at.school_name as away_school, at.logo_url as away_logo,
        v.name as venue_name
       FROM matches m
       LEFT JOIN teams ht ON m.home_team_id = ht.id
       LEFT JOIN teams at ON m.away_team_id = at.id
       LEFT JOIN venues v ON m.venue_id = v.id
       WHERE m.id = ?`,
      [matchId]
    );

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Pertandingan tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 2. Periksa apakah sudah ada data BAP di tabel match_bap
    const existingBap = queryOne<any>('SELECT * FROM match_bap WHERE match_id = ?', [matchId]);
    if (existingBap) {
      let periodScores = { firstHalf: [0, 0], secondHalf: [0, 0] };
      let goals = [];
      let cards = [];
      let fouls = { home: 0, away: 0 };
      let timeouts = { home: 0, away: 0 };

      try {
        periodScores = JSON.parse(existingBap.period_scores_json || '{}');
        goals = JSON.parse(existingBap.goals_json || '[]');
        cards = JSON.parse(existingBap.cards_json || '[]');
        fouls = JSON.parse(existingBap.fouls_json || '{}');
        timeouts = JSON.parse(existingBap.timeouts_json || '{}');
      } catch (e) {
        console.error('Error parsing BAP json fields:', e);
      }

      return NextResponse.json({
        success: true,
        bap: {
          id: existingBap.id,
          matchId: existingBap.match_id,
          matchNumber: match.match_no,
          homeTeamName: match.home_team_name,
          awayTeamName: match.away_team_name,
          venueName: match.venue_name,
          finalScoreHome: existingBap.final_score_home,
          finalScoreAway: existingBap.final_score_away,
          periodScores,
          goals,
          cards,
          fouls,
          timeouts,
          referee1Name: existingBap.referee_1_name || 'Wasit Utama 1',
          referee1Sig: existingBap.referee_1_sig || null,
          referee1SignedAt: existingBap.referee_1_signed_at || null,
          referee2Name: existingBap.referee_2_name || 'Wasit Utama 2',
          referee2Sig: existingBap.referee_2_sig || null,
          referee2SignedAt: existingBap.referee_2_signed_at || null,
          commissionerName: existingBap.commissioner_name || 'Pengawas Pertandingan (PP)',
          commissionerSig: existingBap.commissioner_sig || null,
          commissionerSignedAt: existingBap.commissioner_signed_at || null,
          verificationCode: existingBap.verification_code,
          status: existingBap.status,
          notes: existingBap.notes || '',
          createdAt: existingBap.created_at,
          updatedAt: existingBap.updated_at,
        },
      });
    }

    // 3. Jika belum dibuat, kompilasi dari peristiwa pertandingan (match_events)
    const events = query<any>(
      `SELECT e.*, p.full_name as player_name, p.jersey_number, t.name as team_name
       FROM match_events e
       LEFT JOIN players p ON e.player_id = p.id
       LEFT JOIN teams t ON e.team_id = t.id
       WHERE e.match_id = ? AND e.voided_at IS NULL
       ORDER BY e.seq ASC`,
      [matchId]
    );

    let homeGoals = 0;
    let awayGoals = 0;
    const goalsList: any[] = [];
    const cardsList: any[] = [];
    let homeFouls = 0;
    let awayFouls = 0;
    let homeTimeouts = 0;
    let awayTimeouts = 0;

    for (const ev of events) {
      const isHome = ev.team_id === match.home_team_id;
      if (ev.type === 'GOAL') {
        if (isHome) homeGoals++;
        else awayGoals++;

        goalsList.push({
          minute: Math.floor((ev.clock_ms || 0) / 60000) + 1,
          teamId: ev.team_id,
          teamName: ev.team_name,
          playerId: ev.player_id,
          playerName: ev.player_name || 'Pemain',
          jerseyNumber: ev.jersey_number || null,
        });
      } else if (ev.type === 'YELLOW_CARD' || ev.type === 'RED_CARD') {
        cardsList.push({
          minute: Math.floor((ev.clock_ms || 0) / 60000) + 1,
          teamId: ev.team_id,
          teamName: ev.team_name,
          playerName: ev.player_name || 'Pemain',
          cardType: ev.type === 'RED_CARD' ? 'RED' : 'YELLOW',
        });
      } else if (ev.type === 'FOUL') {
        if (isHome) homeFouls++;
        else awayFouls++;
      } else if (ev.type === 'TIMEOUT') {
        if (isHome) homeTimeouts++;
        else awayTimeouts++;
      }
    }

    // Fallback skor dari kolom result jika events kosong
    if (goalsList.length === 0 && match.result) {
      try {
        const res = JSON.parse(match.result);
        homeGoals = res.scoreHome || 0;
        awayGoals = res.scoreAway || 0;
      } catch {}
    }

    const verificationCode = `BAP-MMFC-${randomUUID().slice(0, 8).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      bap: {
        id: `draft_bap_${matchId}`,
        matchId: match.id,
        matchNumber: match.match_no,
        homeTeamName: match.home_team_name,
        awayTeamName: match.away_team_name,
        venueName: match.venue_name,
        finalScoreHome: homeGoals,
        finalScoreAway: awayGoals,
        periodScores: {
          firstHalf: [Math.floor(homeGoals / 2), Math.floor(awayGoals / 2)],
          secondHalf: [homeGoals - Math.floor(homeGoals / 2), awayGoals - Math.floor(awayGoals / 2)],
        },
        goals: goalsList,
        cards: cardsList,
        fouls: { home: homeFouls, away: awayFouls },
        timeouts: { home: homeTimeouts, away: awayTimeouts },
        referee1Name: 'Wasit Utama 1 (Nasional)',
        referee1Sig: null,
        referee1SignedAt: null,
        referee2Name: 'Wasit Utama 2 (Nasional)',
        referee2Sig: null,
        referee2SignedAt: null,
        commissionerName: 'Pengawas Pertandingan (PP) MMFC I',
        commissionerSig: null,
        commissionerSignedAt: null,
        verificationCode,
        status: 'DRAFT',
        notes: 'Rekapitulasi draf lembar berita acara pertandingan.',
      },
    });
  } catch (error: any) {
    console.error('Error fetching match BAP:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyusun lembar Berita Acara Pertandingan (BAP).' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const {
      role, // 'referee_1' | 'referee_2' | 'commissioner'
      signerName,
      signatureToken = '',
      notes = '',
    } = body;

    if (!role || !['referee_1', 'referee_2', 'commissioner'].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Peran penandatangan tidak valid. Harus 'referee_1', 'referee_2', atau 'commissioner'.",
        },
        { status: 400 }
      );
    }

    if (!signerName || !signerName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama penandatangan digital wajib diisi.' },
        { status: 400 }
      );
    }

    // Otorisasi ketat: Hanya ADMIN atau REFEREE yang berhak membubuhkan tanda tangan BAP
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;
    const userId = user.id;

    // Validasi wewenang penandatanganan sesuai peran pengguna
    if (user.role === 'REFEREE') {
      if (role === 'commissioner') {
        return NextResponse.json(
          {
            success: false,
            error: 'Akses ditolak: Hanya Admin/Komisioner yang dapat menandatangani sebagai Pengawas Pertandingan.',
          },
          { status: 403 }
        );
      }
      const isAssigned = user.assignedMatchIds?.includes(matchId);
      const officialRow = queryOne<any>(
        'SELECT id FROM match_officials WHERE match_id = ? AND profile_id = ?',
        [matchId, user.id]
      );
      if (!isAssigned && !officialRow && user.assignedMatchIds && user.assignedMatchIds.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Akses ditolak: Anda tidak memiliki penugasan resmi untuk pertandingan ini.',
          },
          { status: 403 }
        );
      }
    }

    const cleanSigner = signerName.trim();
    const token = signatureToken || `SIG_${role.toUpperCase()}_${Date.now()}_${randomUUID().slice(0, 6)}`;

    // 1. Ambil atau buat rekaman di match_bap
    let bap = queryOne<any>('SELECT * FROM match_bap WHERE match_id = ?', [matchId]);

    if (!bap) {
      // Ambil skor laga
      const match = queryOne<any>('SELECT * FROM matches WHERE id = ?', [matchId]);
      if (!match) {
        return NextResponse.json({ success: false, error: 'Laga tidak ditemukan.' }, { status: 404 });
      }

      let homeScore = 0;
      let awayScore = 0;
      try {
        const res = JSON.parse(match.result || '{}');
        homeScore = res.scoreHome || 0;
        awayScore = res.scoreAway || 0;
      } catch {}

      const bapId = `bap_${matchId}`;
      const verificationCode = `BAP-MMFC-${randomUUID().slice(0, 8).toUpperCase()}`;

      run(
        `INSERT INTO match_bap (
          id, match_id, final_score_home, final_score_away, verification_code, status, notes
        ) VALUES (?, ?, ?, ?, ?, 'DRAFT', ?)`,
        [bapId, matchId, homeScore, awayScore, verificationCode, notes.trim()]
      );

      bap = queryOne<any>('SELECT * FROM match_bap WHERE match_id = ?', [matchId]);
    }

    // 2. Bubuhkan tanda tangan sesuai peran
    const nowIso = new Date().toISOString();
    let updateSql = '';
    const updateParams: unknown[] = [];

    if (role === 'referee_1') {
      updateSql = `UPDATE match_bap SET referee_1_name = ?, referee_1_sig = ?, referee_1_signed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE match_id = ?`;
      updateParams.push(cleanSigner, token, nowIso, matchId);
    } else if (role === 'referee_2') {
      updateSql = `UPDATE match_bap SET referee_2_name = ?, referee_2_sig = ?, referee_2_signed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE match_id = ?`;
      updateParams.push(cleanSigner, token, nowIso, matchId);
    } else {
      updateSql = `UPDATE match_bap SET commissioner_name = ?, commissioner_sig = ?, commissioner_signed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE match_id = ?`;
      updateParams.push(cleanSigner, token, nowIso, matchId);
    }

    run(updateSql, updateParams);

    // 3. Periksa kelengkapan ketiga tanda tangan
    const updatedBap = queryOne<any>('SELECT * FROM match_bap WHERE match_id = ?', [matchId]);
    const isFullySigned = Boolean(
      updatedBap.referee_1_sig && updatedBap.referee_2_sig && updatedBap.commissioner_sig
    );

    if (isFullySigned && updatedBap.status !== 'BAP_SIGNED') {
      run(
        `UPDATE match_bap SET status = 'BAP_SIGNED', updated_at = CURRENT_TIMESTAMP WHERE match_id = ?`,
        [matchId]
      );

      // Transisi status pertandingan ke bap_signed jika laga saat ini berstatus finished
      const match = queryOne<any>('SELECT status FROM matches WHERE id = ?', [matchId]);
      if (match && (match.status === 'finished' || match.status === 'scheduled')) {
        run(
          `UPDATE matches SET status = 'bap_signed', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [matchId]
        );
      }
    }

    // 4. Catat audit log
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'sign_bap', 'match_bap', ?, ?, ?, ?)`,
      [
        auditId,
        userId,
        bap.id,
        JSON.stringify({ role, signed: false }),
        JSON.stringify({ role, signer: cleanSigner, isFullySigned }),
        `Pengesahan digital BAP oleh ${cleanSigner} (${role})`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: isFullySigned
        ? 'Ketiga pihak (Wasit 1, Wasit 2, Pengawas) telah menandatangani BAP! Status laga beralih ke BAP_SIGNED.'
        : `Tanda tangan digital ${cleanSigner} (${role}) berhasil dibubuhkan. Menunggu penandatangan lainnya.`,
      bap: updatedBap,
      isFullySigned,
    });
  } catch (error: any) {
    console.error('Error signing match BAP:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses tanda tangan digital Berita Acara Pertandingan.' },
      { status: 500 }
    );
  }
}

