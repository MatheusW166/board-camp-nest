export const DbErrors = {
  duplicatedKey: "duplicate key value",
};

export const DbErrorsExplain = {
  gameInsertionConflict: "this game already exists",
  customerInsertionConflict: "there is another customer with this cpf",
  gameOutOfStock: "game out of stock",
  gameNotFound: "game not found",
  rentalNotFound: "rental not found",
  rentalFinished: "rental already finished",
  rentalNotFinished: "rental is not finished, thus can't be deleted",
  customerNotFound: "customer not found",
  generic: "something went wrong, try again later",
};
