#### General Data Flow

- [READ] component asks / "fetches" data from <--> "store/composable" <--> service <--> tauri 
- [WRITE] component updates --> store updates locally and calls --> service command //eager and optimistic.