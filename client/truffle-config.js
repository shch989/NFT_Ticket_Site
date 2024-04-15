module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
  },

  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',

  // 컴파일러 설정을 정의합니다.
  compilers: {
    // Solidity 컴파일러 버전을 지정합니다.
    solc: {
      // 사용할 Solidity 컴파일러 버전을 지정합니다.
      version: "0.8.13",
      // 옵티마이저를 활성화하고 최적화 옵션을 설정합니다.
      optimizer: {
        // 옵티마이저를 활성화합니다.
        enabled: 'true',
        // 옵티마이저가 실행될 횟수를 지정합니다.
        runs: 200
      }
    }
  }
}