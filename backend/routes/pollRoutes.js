const express = require('express');
const router = express.Router();
const {
  getPolls,
  getPoll,
  createPoll,
  votePoll,
  updatePoll,
  deletePoll,
} = require('../controllers/pollController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getPolls)
  .post(protect, createPoll);

router.route('/:id')
  .get(getPoll)
  .put(protect, updatePoll)
  .delete(protect, deletePoll);

router.route('/:id/vote')
  .patch(votePoll);

module.exports = router;
