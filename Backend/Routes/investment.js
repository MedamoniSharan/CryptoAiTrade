const express = require('express');
const Investment = require('../Models/Investment');

const router = express.Router();

// Middleware to parse JSON and URL-encoded data
router.use(express.json());
router.use(express.urlencoded ({ extended: true }));

// Existing Routes...

// Route to submit a new investment
router.post('/submit-investment', async (req, res) => {
  try {
    const {
      userId,
      username,
      userEmail,
      tradingPair,
      investmentAmount,
      expectedProfit,
      withdrawalDate,
      proofFileBase64, 
      status
    } = req.body;

    const newInvestment = new Investment({
      userId,
      username,
      userEmail,
      tradingPair,
      investmentAmount,
      expectedProfit,
      withdrawalDate,
      proofFile: proofFileBase64, 
      status
    });

    await newInvestment.save();
    res.status(201).json({ message: 'Investment data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save investment data' });
  }
});

// Route to fetch investments by userId
router.post('/fetch-investments', async (req, res) => {
  const { userId } = req.body; 

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const investments = await Investment.find({ userId }); 
    if (!investments.length) {
      return res.status(404).json({ message: 'No investments found for this user' });
    }

    res.status(200).json(investments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching investments' });
  }
});

// Route to get all investments
router.get('/getAllInvestment', async(req, res)=>{
  try{
    const investment = await Investment.find({});
    res.status(200).json(investment);
  } catch(error){
    console.error(error);
    res.status(500).json({
      message : "Error fetching all investment details"
    });
  }
});

router.post('/updateInvestmentStatus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedInvestment = await Investment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedInvestment);
  } catch (error) {
    console.error('Error updating investment status:', error);
    res.status(500).json({ message: 'Error updating investment status' });
  }
});

// Ensure this route exists and is using the correct method (PUT)
router.post('/updateInvestmentProfit/:id', async (req, res) => {
  console.log('Received PUT request to /updateInvestmentProfit/:id');
  console.log('ID:', req.params.id);  // Logs the ID passed in the URL
  console.log('Expected Profit:', req.body.expectedProfit);  // Logs the expectedProfit passed in the body

  const { id } = req.params;
  const { expectedProfit } = req.body;

  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(
      id,
      { expectedProfit },  // Update the expectedProfit value
      { new: true }  // Return the updated document
    );

    if (!updatedInvestment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.status(200).json(updatedInvestment);  // Send back the updated investment
  } catch (error) {
    console.error('Error updating expected profit:', error);
    res.status(500).json({ message: 'Error updating expected profit' });
  }
});




module.exports = router;

