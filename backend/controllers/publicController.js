const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const supabase = db.supabase;

// Get all public packages (e.g., for website visitors)
const getPublicPackages = async (req, res) => {
  try {
    const { destination } = req.query;

    let query = supabase
      .from('packages')
      .select('id, title, description, destination, price, currency, duration_days, included_services, max_participants, image_url')
      .order('created_at', { ascending: false })
      .limit(20);

    if (destination) {
      query = query.ilike('destination', `%${destination}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    res.json({
      success: true,
      count: (data || []).length,
      data: data || [],
    });
  } catch (err) {
    console.error('Error fetching public packages:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar pacotes públicos.' });
  }
};

// Submit lead / reservation from public planner or contact form
const createPublicReservation = async (req, res) => {
  try {
    const {
      package_id,
      client_name,
      client_email,
      client_phone,
      participants_count,
      travel_date,
      notes,
    } = req.body;

    if (!client_name || !client_email) {
      return res.status(400).json({
        success: false,
        error: 'Nome e e-mail são obrigatórios para enviar sua solicitação.',
      });
    }

    let agencyId = null;
    let totalPrice = 0;

    if (package_id) {
      const { data: pkg } = await supabase
        .from('packages')
        .select('agency_id, price')
        .eq('id', package_id)
        .single();

      if (pkg) {
        agencyId = pkg.agency_id;
        const count = parseInt(participants_count, 10) || 1;
        totalPrice = parseFloat(pkg.price) * count;
      }
    }

    // If no agency linked via package, assign to first active agency
    if (!agencyId) {
      const { data: defaultAgencies } = await supabase
        .from('agencies')
        .select('id')
        .eq('status', 'active')
        .order('created_at', { ascending: true })
        .limit(1);

      if (defaultAgencies && defaultAgencies.length > 0) {
        agencyId = defaultAgencies[0].id;
      }
    }

    const reservationId = uuidv4();
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        id: reservationId,
        package_id: package_id || null,
        agency_id: agencyId,
        client_name: client_name.trim(),
        client_email: client_email.toLowerCase().trim(),
        client_phone: client_phone || null,
        participants_count: parseInt(participants_count, 10) || 1,
        travel_date: travel_date || null,
        status: 'pendente',
        total_price: totalPrice,
        notes: notes || 'Solicitação enviada pelo site público.',
      })
      .select('id, client_name, client_email, status, created_at')
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({
      success: true,
      message: 'Sua solicitação de viagem foi recebida com sucesso! Em breve entraremos em contato.',
      data,
    });
  } catch (err) {
    console.error('Error submitting public reservation:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar solicitação de viagem: ' + err.message,
    });
  }
};

module.exports = {
  getPublicPackages,
  createPublicReservation,
};
