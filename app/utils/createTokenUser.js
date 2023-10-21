const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    organizer: user.organizer,
  }
}

const createTokenParticipant = (participan) => {
  return {
    firstName: participan.firstName,
    lastName: participan.lastName,
    email: participan.email,
    participanId: participan._id,
  }
}

module.exports = { createTokenUser, createTokenParticipant }
