# Aptos Todolist dApp

A modern, decentralized todolist application built on the Aptos blockchain. This dApp allows users to create, manage, and track their tasks permanently on-chain with a beautiful, responsive user interface.

## 🌟 Features

- **On-Chain Task Management**: All tasks are stored permanently on the Aptos blockchain
- **Wallet Integration**: Seamless connection with Aptos-compatible wallets
- **Task Operations**: Create, complete, and delete tasks with blockchain transactions
- **Beautiful UI**: Modern design with dark/light/system theme support
- **Progress Tracking**: Visual progress indicators and task statistics
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Automatic refresh after blockchain transactions

## 🏗️ Architecture

### Smart Contract (Move)
- **Module**: `huy_addr::todolist`
- **Language**: Move programming language
- **Network**: Aptos Testnet
- **Features**:
  - User-specific todolist creation
  - Task addition with timestamp validation
  - Task completion tracking
  - Task removal functionality
  - View functions for todolist existence

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Blockchain SDK**: Aptos TS SDK v2.0.0
- **Wallet Adapter**: Aptos Wallet Adapter
- **State Management**: TanStack React Query
- **Theme**: Dark/Light/System mode support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **Aptos CLI** (installed via npm)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/huyphamcs/aptos-todolist-dapp.git
cd aptos-todolist-dapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
PROJECT_NAME=aptos-todolist-dapp
VITE_APP_NETWORK=testnet
VITE_APTOS_API_KEY=""
VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS=your_account_address
VITE_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY=your_private_key
VITE_MODULE_ADDRESS=your_deployed_module_address
```

**⚠️ Security Note**: Never commit your private keys to version control. The private key is only needed for contract deployment.

### 4. Compile and Deploy the Smart Contract

```bash
# Compile the Move contract
npm run move:compile

# Run Move tests (optional)
npm run move:test

# Deploy the contract to testnet
npm run move:publish
```

The deployment script will automatically update your `.env` file with the deployed module address.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Commands

### Smart Contract Commands

- `npm run move:compile` - Compile the Move contract
- `npm run move:test` - Run Move unit tests
- `npm run move:publish` - Deploy contract and generate ABI
- `npm run move:upgrade` - Upgrade existing contract

### Frontend Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run fmt` - Format code with Prettier

### Deployment Commands

- `npm run deploy` - Deploy to Vercel

## 📱 How to Use

### 1. Connect Your Wallet
- Click the "Connect Wallet" button in the header
- Choose from supported Aptos wallets (Petra, Martian, etc.)
- Approve the connection

### 2. Create Your Todolist
- If this is your first time, click "Create My Todolist"
- This will create your personal todolist resource on-chain
- The transaction requires a small gas fee

### 3. Manage Tasks
- **Add Tasks**: Type in the input field and press Enter or click the + button
- **Complete Tasks**: Click the checkmark button next to any task
- **Delete Tasks**: Click the trash button to remove tasks
- **View Progress**: Check your completion statistics in the dashboard

## 🏛️ Smart Contract Details

### Core Functions

```move
// Create a new todolist for the user
public entry fun create_list(account: &signer)

// Add a new task with timestamp
public entry fun add_task(
    account: &signer,
    content: String,
    day: u64, month: u64, year: u64,
    hour: u64, mins: u64, secs: u64
)

// Mark a task as completed by index
public entry fun mark_as_completed(account: &signer, index: u64)

// Remove a task by index
public entry fun remove_task(account: &signer, index: u64)

// Check if a todolist exists for an address
#[view]
public fun todolist_exists(account_addr: address): bool
```

### Data Structures

```move
public struct Todolist has key {
    tasks: vector<Task>
}

struct Task has store, copy, drop {
    content: String,
    isCompleted: bool,
    timestamp: TimeCreate
}

struct TimeCreate has store, copy, drop {
    date: Date,
    time_in_day: TimeInDay
}
```

## 🎨 UI Features

### Theme Support
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for low-light usage
- **System Mode**: Automatically matches your OS preference

### Responsive Design
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly buttons and interactions
- Adaptive layouts

### Visual Feedback
- Loading states for all blockchain operations
- Success/error toast notifications
- Smooth animations and transitions
- Progress tracking with visual indicators

## 🛠️ Development

### Project Structure

```
aptos-todolist-dapp/
├── contract/                 # Move smart contract
│   ├── sources/
│   │   └── todolist.move    # Main contract file
│   ├── Move.toml            # Move package configuration
│   └── build/               # Compiled contract artifacts
├── frontend/                # React frontend
│   ├── components/          # React components
│   ├── utils/               # Utility functions
│   ├── view-functions/      # Blockchain view functions
│   └── App.tsx              # Main app component
├── scripts/                 # Build and deployment scripts
│   └── move/                # Move-related scripts
└── package.json             # Node.js dependencies
```

### Adding New Features

1. **Smart Contract**: Modify `contract/sources/todolist.move`
2. **Frontend**: Add components in `frontend/components/`
3. **Blockchain Integration**: Add view functions in `frontend/view-functions/`
4. **Styling**: Use Tailwind CSS classes and shadcn/ui components

### Testing

```bash
# Test the Move contract
npm run move:test

# Run frontend tests (if implemented)
npm test
```

## 🌐 Deployment

### Testnet Deployment
1. Fund your account with test APT from the [Aptos Faucet](https://aptoslabs.com/testnet-faucet)
2. Run `npm run move:publish` to deploy to testnet
3. Test your dApp thoroughly

### Mainnet Deployment
1. Change `VITE_APP_NETWORK=mainnet` in your `.env`
2. Fund your account with real APT
3. Deploy with `npm run move:publish`
4. Deploy frontend with `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Aptos Documentation](https://aptos.dev/)
- [Aptos TS SDK](https://github.com/aptos-labs/aptos-core/tree/main/ecosystem/typescript/sdk)
- [Move Language Documentation](https://move-language.github.io/move/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Aptos Developer Documentation](https://aptos.dev/)
2. Join the [Aptos Discord](https://discord.gg/aptoslabs)
3. Open an issue in this repository

---

Built with ❤️ on the Aptos blockchain
