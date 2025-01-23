const express = require('express');
const Investment = require('../Models/Investment');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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

router.get('/getAllInvestment', async(req, res)=>{
  try{
    const investment = await Investment.find({});
    // console.log("response  ", investment);
    res.status(200).json(investment)

  }catch(error){
    console.error(error);
    res.status(500).json({
      message : "error in getall investment details"
    })
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


module.exports = router;
