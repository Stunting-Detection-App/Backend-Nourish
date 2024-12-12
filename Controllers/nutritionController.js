const db = require('../config/db');

const getFoodRecommendations = (req, res) => {
    const { classification } = req.query;
    if (!classification || ![0, 1, 2, 3].includes(Number(classification))) {
        return res.status(400).json({
          error: "Invalid classification parameter. Use values 0, 1, 2, or 3.",
        });
      }

    const query = `
        SELECT food, category, serving_size, calories, protein, fats, vitamin_a, vitamin_c, vitamin_d, vitamin_e, vitamin_b1, vitamin_b2
        FROM nutrition
        WHERE classification = ?
        ORDER BY RAND()
        LIMIT 5;
    `;
    db.query(query, [Number(classification)], (err, results) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ error: "Internal server error" });
        }
    
        if (results.length === 0) {
          return res.status(404).json({
            error: "No food recommendations available for the given classification.",
          });
        }
    
        // Response JSON
        res.json({
          recommendations: results,
          classification: getClassificationName(Number(classification)),
        });
      });
    };
    
    // Helper untuk nama klasifikasi
    const getClassificationName = (classification) => {
      const classifications = [
        "Severely Stunted",
        "Stunted",
        "Normal",
        "High",
      ];
      return classifications[classification] || "Unknown";
    };
    
    module.exports = { getFoodRecommendations };