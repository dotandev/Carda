use aiken/serialise
use shared/types

type ConsentDatum {
  user: User,
  signed_at: Int
}

impl serialise::Data for ConsentDatum
