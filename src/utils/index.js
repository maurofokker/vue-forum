const countObjectProperties = obj => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }
  return 0
}

// export object to later import only what we need
export {
  countObjectProperties
}
