function makeAuthHeader(user) {
  const token = Buffer.from(`${user.username}:${user.password}`).toString(
    "base64"
  );
  return `Basic ${token}`;
}

module.exports = { makeAuthHeader }