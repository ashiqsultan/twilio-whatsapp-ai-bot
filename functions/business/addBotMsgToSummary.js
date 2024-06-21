const consultationService = require('../services/consultation');
const addBotMsgToSummary = async (phone_no, chatSummary = '', botMsg = '') => {
  try {
    if (!botMsg && !chatSummary) {
      return false;
    }
    const newSummary = `${chatSummary} Bot said:${botMsg}.`;
    const _updatedSummaryOp = await consultationService.updateSummaryByPhoneNo(
      phone_no,
      newSummary
    );
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = addBotMsgToSummary;
