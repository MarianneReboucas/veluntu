const db = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const agencyId = req.agencyId;

    // Fetch packages summary
    const packagesResult = await db.query(
      'SELECT id, price FROM packages WHERE agency_id = $1',
      [agencyId]
    );
    const packages = packagesResult.rows;

    // Fetch reservations summary
    const reservationsResult = await db.query(
      `SELECT r.id, r.client_name, r.client_email, r.status, r.total_price, r.created_at,
              p.title as package_title
       FROM reservations r
       LEFT JOIN packages p ON r.package_id = p.id
       WHERE r.agency_id = $1 OR p.agency_id = $1
       ORDER BY r.created_at DESC`,
      [agencyId]
    );
    const reservations = reservationsResult.rows;

    const totalPackages = packages.length;
    const avgPrice = totalPackages > 0
      ? packages.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) / totalPackages
      : 0;

    const totalReservations = reservations.length;
    const pendingReservations = reservations.filter((r) => r.status === 'pendente').length;
    const confirmedReservations = reservations.filter((r) => r.status === 'confirmada').length;
    const cancelledReservations = reservations.filter((r) => r.status === 'cancelada').length;

    const totalRevenue = reservations.reduce((acc, r) => acc + (parseFloat(r.total_price) || 0), 0);
    const confirmedRevenue = reservations
      .filter((r) => r.status === 'confirmada')
      .reduce((acc, r) => acc + (parseFloat(r.total_price) || 0), 0);

    const recentActivity = reservations.slice(0, 5).map((r) => ({
      id: r.id,
      client_name: r.client_name,
      client_email: r.client_email,
      status: r.status,
      total_price: r.total_price,
      created_at: r.created_at,
      package_title: r.package_title || null,
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
        },
        revenue: {
          total: totalRevenue,
          confirmed: confirmedRevenue,
        },
        recent_activity: recentActivity,
      },
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, error: 'Erro ao carregar estatísticas: ' + err.message });
  }
};

module.exports = {
  getDashboardStats,
};
