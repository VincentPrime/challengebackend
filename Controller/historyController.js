import SearchHistory from "../Models/history.js";

export const createHistory = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { ip_address, city, region, country, latitude, longitude, timezone } = req.body;

    if (!ip_address) {
      return res.status(400).json({ message: "IP address is required" });
    }

    const history = await SearchHistory.create({
      user_id: userId,
      ip_address,
      city,
      region,
      country,
      latitude,
      longitude,
      timezone,
    });

    res.status(201).json({ message: "History saved", history });
  } catch (error) {
    console.error('Create history error:', error);
    res.status(500).json({ message: error.message || "Failed to save history" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const history = await SearchHistory.findAll({
      where: { user_id: userId },
      order: [['searched_at', 'DESC']],
    });

    res.json({ history });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: error.message || "Failed to fetch history" });
  }
};

export const bulkDeleteHistory = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { ids } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid IDs array" });
    }

    // Delete only records that belong to this user
    const deleted = await SearchHistory.destroy({
      where: {
        id: ids,
        user_id: userId
      }
    });

    res.json({ message: `${deleted} records deleted`, deleted });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: error.message || "Failed to delete history" });
  }
};