const Poll = require('../models/Poll');

// @desc    Get all polls
// @route   GET /api/polls
// @access  Public
const getPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find({})
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single poll by ID
// @route   GET /api/polls/:id
// @access  Public
const getPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('creator', 'name email');

    if (!poll) {
      res.status(404);
      throw new Error('Poll not found');
    }

    res.json(poll);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new poll
// @route   POST /api/polls
// @access  Private
const createPoll = async (req, res, next) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options)) {
      res.status(400);
      throw new Error('Please provide question and options');
    }

    if (options.length < 2 || options.length > 6) {
      res.status(400);
      throw new Error('Poll must have between 2 and 6 options');
    }

    // Map options to schema format
    const formattedOptions = options.map((opt) => ({
      text: opt.trim(),
      votes: 0,
    }));

    const poll = await Poll.create({
      question: question.trim(),
      options: formattedOptions,
      creator: req.user._id,
    });

    res.status(201).json(poll);
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on a poll option
// @route   PATCH /api/polls/:id/vote
// @access  Public
const votePoll = async (req, res, next) => {
  try {
    const { optionId } = req.body;

    if (!optionId) {
      res.status(400);
      throw new Error('Option ID is required to vote');
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      res.status(404);
      throw new Error('Poll not found');
    }

    // Find option and increment votes
    const option = poll.options.id(optionId);
    if (!option) {
      res.status(400);
      throw new Error('Invalid option selected');
    }

    option.votes += 1;
    poll.totalVotes += 1;

    await poll.save();

    res.json(poll);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a poll (question/options)
// @route   PUT /api/polls/:id
// @access  Private (Creator only)
const updatePoll = async (req, res, next) => {
  try {
    const { question, options } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      res.status(404);
      throw new Error('Poll not found');
    }

    // Make sure user is the poll creator
    if (poll.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to update this poll');
    }

    if (question) {
      poll.question = question.trim();
    }

    if (options && Array.isArray(options)) {
      if (options.length < 2 || options.length > 6) {
        res.status(400);
        throw new Error('Poll must have between 2 and 6 options');
      }

      // Re-map or preserve votes if the option exists
      poll.options = options.map((opt) => {
        // If option exists with text and/or id, try to keep votes
        const existingOption = poll.options.find(
          (o) => o._id.toString() === opt._id || o.text === opt.text
        );
        return {
          text: opt.text ? opt.text.trim() : opt.trim(),
          votes: existingOption ? existingOption.votes : 0,
        };
      });
      
      // Re-calculate totalVotes based on options
      poll.totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    }

    await poll.save();
    
    const updatedPoll = await Poll.findById(poll._id).populate('creator', 'name email');
    res.json(updatedPoll);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a poll
// @route   DELETE /api/polls/:id
// @access  Private (Creator only)
const deletePoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      res.status(404);
      throw new Error('Poll not found');
    }

    // Make sure user is the poll creator
    if (poll.creator.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to delete this poll');
    }

    await Poll.deleteOne({ _id: req.params.id });

    res.json({ message: 'Poll removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPolls,
  getPoll,
  createPoll,
  votePoll,
  updatePoll,
  deletePoll,
};
