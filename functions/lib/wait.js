module.exports = async (seconds = 2) => {
   const millis = seconds * 1000
   return new Promise((r) => {
      setTimeout(r, millis)
   })
}
