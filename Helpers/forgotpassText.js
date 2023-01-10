const createText = (payload) => {
  const text = `Hello ${payload.userName} 👋
    This is the link to reset your password,
    This time try to remember your new password😁, Store it somewhere you can access🔒
    ⚠️ This link is only valid for 5 minutes!!!`;
  return text;
};

module.exports = createText;
