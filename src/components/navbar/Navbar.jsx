import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import logo from "../../images/logo/logo.png";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";

const getMetaMaskProvider = () => {
  if (typeof window === "undefined") return null;

  const { ethereum } = window;
  if (!ethereum) return null;

  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    const metamaskProvider = ethereum.providers.find(
      (provider) => provider.isMetaMask && !provider.isCoinbaseWallet
    );
    return metamaskProvider || null;
  }

  if (ethereum.isMetaMask && !ethereum.isCoinbaseWallet) {
    return ethereum;
  }

  return null;
};

function NavBar() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");

  const getNetworkName = (chainId) => {
    const networkByChainId = {
      "0x1": "Ethereum Mainnet",
      "0xaa36a7": "Sepolia",
      "0x89": "Polygon",
      "0x38": "BNB Smart Chain",
      "0xa": "Optimism",
      "0xa4b1": "Arbitrum One",
      "0x2105": "Base",
    };

    return chainId ? networkByChainId[chainId] || chainId : "";
  };

  useEffect(() => {
    const ethereum = getMetaMaskProvider();

    if (!ethereum) {
      setIsMetaMaskInstalled(false);
      return undefined;
    }

    setIsMetaMaskInstalled(true);

    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      setAddress(accounts[0] || null);
      setIsConnected(accounts.length > 0);
    });

    ethereum.request({ method: "eth_chainId" }).then((chainId) => {
      setNetwork(chainId || null);
    });

    const handleAccountsChanged = (accounts) => {
      setAddress(accounts[0] || null);
      setIsConnected(accounts.length > 0);
      setError("");
      window.dispatchEvent(new CustomEvent("wallet:accountChanged"));
    };

    const handleChainChanged = (chainId) => {
      setNetwork(chainId || null);
      ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        setAddress(accounts[0] || null);
        setIsConnected(accounts.length > 0);
      });
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const disconnectWallet = () => {
    setAddress(null);
    setNetwork(null);
    setIsConnected(false);
    setIsConnecting(false);
    setCopyMessage("");
    setError("");
  };

  const connectWallet = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError("");
    const ethereum = getMetaMaskProvider();

    if (!ethereum) {
      setIsMetaMaskInstalled(false);
      window.open("https://metamask.io/download.html", "_blank", "noopener,noreferrer");
      setIsConnecting(false);
      return;
    }

    try {
      if (ethereum.isMetaMask !== true) {
        setError("Provider atual nao e MetaMask. Desative outras extensoes e recarregue.");
        setIsConnected(false);
        setIsConnecting(false);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      if (!accounts || accounts.length === 0) {
        setError("Nenhuma conta encontrada no MetaMask.");
        setIsConnected(false);
        setIsConnecting(false);
        return;
      }

      setAddress(accounts[0]);
      setIsConnected(true);

      const chainId = await ethereum.request({ method: "eth_chainId" });
      setNetwork(chainId || null);
    } catch (err) {
      setIsConnected(false);
      if (err?.code === 4001) {
        setError("Conexao cancelada no MetaMask. Clique novamente para tentar.");
      } else {
        setError(err?.message || "Erro ao conectar com o MetaMask.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopyMessage("Endereco copiado.");
      setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage("Nao foi possivel copiar.");
      setTimeout(() => setCopyMessage(""), 1800);
    }
  };

  const formattedAddress =
    address && address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;

  return (
    <Navbar expand="lg" className="py-3">
      <Container>
        <Navbar.Brand href="#" className="me-lg-5">
          <img className="logo" src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="#action1">Marketplace</Nav.Link>
            <Nav.Link href="#action2" className="px-lg-3">
              About Us
            </Nav.Link>
            <Nav.Link href="#action3">Developers</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="d-flex align-items-center order">
          <span className="line d-lg-inline-block d-none"></span>
          <i className="fa-regular fa-heart"></i>
          <Button
            variant={isConnected ? "outline-light" : "primary"}
            className={`btn-primary ${
              isConnected ? "wallet-connected" : ""
            }`}
            onClick={isConnected ? disconnectWallet : connectWallet}
            title={network ? `Network: ${getNetworkName(network)}` : "Connect with MetaMask"}
            disabled={isConnecting}
          >
            {isConnecting
              ? "Conectando..."
              : isConnected
              ? formattedAddress
              : "Connect Wallet"}
          </Button>
          {isConnected && (
            <>
              <small className="wallet-network">{getNetworkName(network)}</small>
              <button
                type="button"
                className="wallet-copy"
                onClick={copyAddress}
                title="Copiar endereco da carteira"
              >
                Copiar
              </button>
            </>
          )}
          {!!copyMessage && <small className="wallet-success">{copyMessage}</small>}
          {!!error && <small className="wallet-error">{error}</small>}
          {!isConnected && !isMetaMaskInstalled && (
            <small className="wallet-error">
              MetaMask nao detectado.
            </small>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
