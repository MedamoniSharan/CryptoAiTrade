const express = require('express');
const router = express.Router();
const Coin = require('../Models/Coin');

// Add a new coin
router.post('/', async (req, res) => {
    try {
      const {
        name,
        price,
        minInvest,
        maxInvest,
        minProfit,
        maxProfit,
        withdrawalDays, // Use this field consistently
        tradeHistory,
      } = req.body;
  
      if (
        !name ||
        !price ||
        !minInvest ||
        !maxInvest ||
        !minProfit ||
        !maxProfit ||
        !withdrawalDays
      ) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const newCoin = new Coin({
        name,
        price,
        minInvest,
        maxInvest,
        minProfit,
        maxProfit,
        withdrawalDays, // Consistent field name
        tradeHistory,
      });
  
      await newCoin.save();
      return res.status(201).json(newCoin);
    } catch (error) {
      console.error('Error adding coin:', error);
      return res.status(500).json({ message: 'Failed to add coin' });
    }
  });
  

// Get all coins
router.get('/', async (req, res) => {
  try {
    const coins = await Coin.find(); // Fetch all coins
    res.status(200).json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ message: 'Failed to fetch coins' });
  }
});

// Update a coin by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, minInvest, maxInvest, minProfit, maxProfit, withdrawalDays, tradeHistory } = req.body; // Changed withdrawalPeriod to withdrawalDays
  
    try {
      // Validate input
      if (!name || !price || !minInvest || !maxInvest || !minProfit || !maxProfit || !withdrawalDays) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Update the coin
      const updatedCoin = await Coin.findByIdAndUpdate(
        id,
        { name, price, minInvest, maxInvest, minProfit, maxProfit, withdrawalDays, tradeHistory },
        { new: true, runValidators: true } // Return the updated document and validate before updating
      );
  
      if (!updatedCoin) {
        return res.status(404).json({ message: 'Coin not found' });
      }
  
      res.status(200).json(updatedCoin);
    } catch (error) {
      console.error('Error updating coin:', error);
      res.status(500).json({ message: 'Failed to update coin' });
    }
  });
  
// Delete a coin by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoin = await Coin.findByIdAndDelete(id);

    if (!deletedCoin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    res.status(200).json({ message: 'Coin deleted successfully' });
  } catch (error) {
    console.error('Error deleting coin:', error);
    res.status(500).json({ message: 'Failed to delete coin' });
  }
});

module.exports = router;
