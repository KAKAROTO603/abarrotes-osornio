import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    const exists = favorites.find(f => f.id === product.id);
    if (exists) {
      toast.info('Este producto ya está en tus favoritos');
      return;
    }
    setFavorites([...favorites, product]);
    toast.success('❤️ Agregado a favoritos');
  };

  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter(f => f.id !== productId));
    toast.success('Eliminado de favoritos');
  };

  const isFavorite = (productId) => {
    return favorites.some(f => f.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};