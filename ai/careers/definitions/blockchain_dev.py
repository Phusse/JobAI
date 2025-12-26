from registry import register_career
from models import Career


BLOCKCHAIN_DEV = register_career(
    Career(
        id = "blockchain-dev",
        title = "Blockchain Developer",
        description = "Builds decentralized applications and smart contracts. Works with Web3, Ethereum, or Solana.",
        traits = ["innovative", "security", "decentralized", "cryptographic", "emerging-tech"],
        categories = ["emerging", "blockchain", "development"],
        keywords = ["blockchain", "Web3", "smart contracts", "crypto", "decentralized", "Ethereum", "Solana"],
    )
)
