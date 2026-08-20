const db = require('../config/database');
const supabase = db.supabase;

const getDashboardStats = async (req, res) => {
  try {
    const agencyId = req.agencyId;

    // Fetch packages for this agency
    const { data: packages, error: pkgErr } = await supabase
      .from('packages')
      .select('id, price')
      .eq('agency_id', agencyId);

    if (pkgErr) throw new Error(pkgErr.message);

    // Fetch reservations for this agency
    const { data: reservations, error: resErr } = await supabase
      .from('reservations')
      .select(`
        id, client_name, client_email, status, total_price, created_at,
        packages:package_id ( title )
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (resErr) throw new Error(resErr.message);

    const totalPackages = (packages || []).length;
    const avgPrice = totalPackages > 0
      ? packages.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) / totalPackages
      : 0;

    const resList = reservations || [];
    const totalReservations = resList.length;
    const pendingReservations = resList.filter((r) => r.status === 'pendente').length;
    const confirmedReservations = resList.filter((r) => r.status === 'confirmada').length;
    const cancelledReservations = resList.filter((r) => r.status === 'cancelada').length;

    const totalRevenue = resList.reduce((acc, r) => acc + (parseFloat(r.total_price) || 0), 0);
    const confirmedRevenue = resList
      .filter((r) => r.status === 'confirmada')
      .reduce((acc, r) => acc + (parseFloat(r.total_price) || 0), 0);

    const recentActivity = resList.slice(0, 5).map((r) => ({
      id: r.id,
      client_name: r.client_name,
      client_email: r.client_email,
      status: r.status,
      total_price: r.total_price,
      created_at: r.created_at,
      package_title: r.packages?.title || null,
    }));

    res.json({
      success: true,
      data: {
        packages: {
          total: totalPackages,
          avg_price: avgPrice,
        },
        reservations: {
          total: totalReservations,
          pending: pendingReservations,
          confirmed: confirmedReservations,
          cancelled: cancelledReservations,
          total_revenue: totalRevenue,
          confirmed_revenue: confirmedRevenue,
        },
        recent_activity: recentActivity,
      },
    });
  } catch (err) {
    console.error('Error calculating dashboard stats:', err);
    res.status(500).json({ success: false, error: 'Erro ao calcular estatísticas: ' + err.message });
  }
};

module.exports = {
  getDashboardStats,
};
