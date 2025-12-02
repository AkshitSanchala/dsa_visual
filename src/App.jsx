import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import BubbleSortPage from './pages/BubbleSortPage';
import SelectionSortPage from './pages/SelectionSortPage';
import QuickSortPage from './pages/QuickSortPage';
import InsertionSortPage from './pages/InsertionSortPage';
import BinarySearchTreePage from './pages/BinarySearchTreePage';
import HeapPage from './pages/HeapPage';
import HashSetPage from './pages/HashSetPage';
import GraphPage from './pages/GraphPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/bubble-sort" element={<BubbleSortPage />} />
        <Route path="/selection-sort" element={<SelectionSortPage />} />
        <Route path="/quick-sort" element={<QuickSortPage />} />
        <Route path="/insertion-sort" element={<InsertionSortPage />} />
        <Route path="/binary-search-tree" element={<BinarySearchTreePage />} />
        <Route path="/heap" element={<HeapPage />} />
        <Route path="/hash-set" element={<HashSetPage />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </Router>
  );
};

export default App;
