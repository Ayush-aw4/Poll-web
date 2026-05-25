/**
 * Formats a date string to the style: YYYY-MM-DD, HH:MM AM/PM
 * Example: 2011-07-21, 11:33 AM
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'AM' : 'PM'; // Note: in screenshot: "11:33 AM" or "11:39 AM" - AM/PM is based on time. Let's make it actual 12-hour format representation.
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hh = String(hours).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}, ${hh}:${minutes} ${ampm}`;
};

/**
 * Calculates percentage for option votes
 */
export const getPercent = (votes, totalVotes) => {
  if (!totalVotes || totalVotes === 0) return 0;
  return Math.round((votes / totalVotes) * 100);
};

/**
 * Checks if a browser session has already voted on a specific poll
 */
export const hasVoted = (pollId) => {
  const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '[]');
  return votedPolls.includes(pollId);
};

/**
 * Saves that the browser session has voted on a specific poll
 */
export const markAsVoted = (pollId) => {
  const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '[]');
  if (!votedPolls.includes(pollId)) {
    votedPolls.push(pollId);
    localStorage.setItem('voted_polls', JSON.stringify(votedPolls));
  }
};
