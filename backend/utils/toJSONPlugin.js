// Applied to every schema so API responses always expose a plain string `id`
// (instead of requiring every frontend call site to know about Mongo's `_id`/
// ObjectId). Keeps `_id` out of the wire format entirely to avoid confusion.
module.exports = function applyToJSON(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      delete ret._id
      return ret
    },
  })
}
