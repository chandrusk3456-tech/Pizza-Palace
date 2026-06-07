import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import PizzaFormModal from '../../components/admin/PizzaFormModal';
import Loader from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiAlertCircle } from 'react-icons/fi';

const AdminPizzas = () => {
  const { addToast } = useToast();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/pizzas');
      setPizzas(data);
    } catch (error) {
      addToast('Failed to fetch pizza catalog', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  const handleToggleAvailability = async (pizza) => {
    try {
      const updatedVal = !pizza.isAvailable;
      const { data } = await api.put(`/pizzas/${pizza._id}`, {
        isAvailable: updatedVal
      });

      // Update local state list
      setPizzas(prev => prev.map(p => p._id === pizza._id ? data : p));
      addToast(`Availability for ${pizza.name} updated!`, 'success');
    } catch (error) {
      addToast('Failed to toggle availability', 'error');
      console.error(error);
    }
  };

  const handleDeletePizza = async (pizzaId, pizzaName) => {
    if (!window.confirm(`Are you sure you want to delete "${pizzaName}" from the menu?`)) {
      return;
    }

    try {
      await api.delete(`/pizzas/${pizzaId}`);
      setPizzas(prev => prev.filter(p => p._id !== pizzaId));
      addToast(`"${pizzaName}" deleted from menu`, 'info');
    } catch (error) {
      addToast('Failed to delete pizza', 'error');
      console.error(error);
    }
  };

  const handleEditClick = (pizza) => {
    setEditingPizza(pizza);
    setFormModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingPizza(null);
    setFormModalOpen(true);
  };

  return (
    <div className="pt-20 min-h-[calc(100vh-80px)] bg-neutralLight flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutralDark">Manage Pizzas</h1>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mt-0.5">Add, Edit or Remove menu items</p>
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 bg-primary text-white font-extrabold text-sm px-6 py-3 rounded-full hover:bg-primary-dark shadow-md hover:shadow-primary/20 transition-all hover:scale-105"
          >
            <FiPlus />
            <span>Add New Pizza</span>
          </button>
        </div>

        {/* Pizzas Catalog Table */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-neutralLight-dark shadow-sm">
            <Loader />
          </div>
        ) : pizzas.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutralLight-dark rounded-3xl p-8 shadow-sm">
            <FiAlertCircle className="text-4xl text-neutral-400 mb-2 mx-auto" />
            <h3 className="text-lg font-bold text-neutralDark">No Pizzas Found</h3>
            <p className="text-neutral-500 text-xs mt-1">Please create a pizza menu item to populate the catalogue.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutralLight-dark shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="bg-neutralLight border-b border-neutralLight-dark text-neutral-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Base Price</th>
                    <th className="py-4 px-6 text-center">Availability</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutralLight-dark text-xs font-semibold text-neutralDark-light">
                  {pizzas.map((pizza) => (
                    <tr key={pizza._id} className="hover:bg-neutralLight/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutralLight-dark">
                          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-sm text-neutralDark block">{pizza.name}</span>
                        <span className="text-[10px] text-neutral-400 font-normal line-clamp-1 max-w-[240px]">{pizza.description}</span>
                      </td>
                      <td className="py-4 px-6 capitalize font-bold">
                        {pizza.category.replace('-', ' ')}
                      </td>
                      <td className="py-4 px-6 font-extrabold text-sm text-neutralDark">
                        ₹{pizza.basePrice}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleToggleAvailability(pizza)}
                          className={`text-2xl transition-colors ${
                            pizza.isAvailable ? 'text-primary' : 'text-neutral-300'
                          }`}
                        >
                          {pizza.isAvailable ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(pizza)}
                            className="p-2 bg-neutralLight hover:bg-primary hover:text-white rounded-lg transition-all text-neutralDark-light"
                            title="Edit Pizza"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeletePizza(pizza._id, pizza.name)}
                            className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg transition-all text-rose-600"
                            title="Delete Pizza"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Forms Popups */}
      <PizzaFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        pizza={editingPizza}
        onSaved={fetchPizzas}
      />
    </div>
  );
};

export default AdminPizzas;
