use cardano/transaction
use cardano/primitive/string
use cardano/assets
use cardano/time

public func string_starts_with(prefix: String, input: String) -> Bool {
  string.starts_with(input, prefix)
}

public func validate_id_format(id: String, prefix: String, min_length: Int) -> Bool {
  string.starts_with(id, prefix) && string.length(id) >= min_length
}

public func list_contains<T>(lst: List<T>, value: T) -> Bool {
  list.has(lst, value)
}

public func is_valid_date(date: Int) -> Bool {
  let current_time = time.now()
  date > current_time
}

public func is_authorized_user(user_role: String, allowed_roles: List<String>) -> Bool {
  list.contains(allowed_roles, user_role)
}

public func addresses_equal(address1: PaymentCredential, address2: PaymentCredential) -> Bool {
  address1 == address2
}

public func log_message(message: String) -> Unit {
  trace message
}

public func unwrap_option<T>(opt: Option<T>, default_value: T) -> T {
  match opt {
    Some(v) -> v
    None -> default_value
  }
}
