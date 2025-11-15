import React, { useState, useEffect } from 'react';
import { Calendar, List, Plus, X, Edit2, Trash2, Filter, ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';

const ITEM_TYPES = {
  activity: { label: 'Actividad', color: 'bg-blue-500', icon: '📝' },
  evaluation: { label: 'Evaluación', color: 'bg-red-500', icon: '📊' },
  questionnaire: { label: 'Cuestionario', color: 'bg-green-500', icon: '📋' },
  forum: { label: 'Foro', color: 'bg-purple-500', icon: '💬' }
};

const STORAGE_KEY = 'academic_calendar_items';

const initialItems = [
  { id: 1, title: 'Tarea de Matemáticas', type: 'activity', deadline: '2025-11-20', description: 'Resolver ejercicios del capítulo 5', completed: false },
  { id: 2, title: 'Examen de Historia', type: 'evaluation', deadline: '2025-11-22', description: 'Examen sobre la Segunda Guerra Mundial', completed: false },
  { id: 3, title: 'Quiz de Química', type: 'questionnaire', deadline: '2025-11-18', description: 'Cuestionario sobre enlaces químicos', completed: true },
  { id: 4, title: 'Debate: Cambio Climático', type: 'forum', deadline: '2025-11-25', description: 'Participación en foro sobre sostenibilidad', completed: false }
];

export default function AcademicCalendar() {
  const [items, setItems] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed : initialItems;
      }
      return initialItems;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialItems;
    }
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');
  const [filterType, setFilterType] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'activity',
    deadline: '',
    description: '',
    completed: false
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [items]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getItemsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return items.filter(item => {
      const matchesDate = item.deadline === dateStr;
      const matchesFilter = filterType === 'all' || item.type === filterType;
      return matchesDate && matchesFilter;
    });
  };

  const filteredItems = filterType === 'all' 
    ? items 
    : items.filter(item => item.type === filterType);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setFormData({ title: '', type: 'activity', deadline: '', description: '', completed: false });
    setIsFormOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setIsModalOpen(false);
  };

  const handleToggleComplete = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, completed: !selectedItem.completed });
    }
  };

  const handleSubmitForm = () => {
    if (!formData.title || !formData.deadline) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id ? { ...formData, id: item.id } : item
      ));
    } else {
      setItems([...items, { ...formData, id: Date.now() }]);
    }
    setIsFormOpen(false);
    setFormData({ title: '', type: 'activity', deadline: '', description: '', completed: false });
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los elementos? Esta acción no se puede deshacer.')) {
      setItems([]);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-32 bg-gray-50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayItems = getItemsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-32 border border-gray-200 p-2 transition-colors hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayItems.map(item => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left px-2 py-1 rounded text-xs font-medium text-white transition-all ${
                    item.completed 
                      ? 'bg-gray-400 opacity-75' 
                      : ITEM_TYPES[item.type].color
                  } hover:scale-105`}
                >
                  <div className="flex items-center gap-1">
                    <span>{ITEM_TYPES[item.type].icon}</span>
                    <span className={`truncate ${item.completed ? 'line-through' : ''}`}>
                      {item.title}
                    </span>
                    {item.completed && (
                      <CheckCircle className="w-3 h-3 ml-auto flex-shrink-0" />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="bg-gray-100 p-3 text-center font-semibold text-sm text-gray-700">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const sortedItems = [...filteredItems].sort((a, b) => 
      new Date(a.deadline) - new Date(b.deadline)
    );

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Elementos</h2>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
            >
              Limpiar Todo
            </button>
          )}
        </div>
        <div className="space-y-3">
          {sortedItems.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all ${
                item.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete(item.id);
                }}
                className="flex-shrink-0 transition-colors hover:scale-110"
              >
                {item.completed ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400 hover:text-green-500" />
                )}
              </button>
              
              <div
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-4 flex-1 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg ${
                  item.completed ? 'bg-gray-400' : ITEM_TYPES[item.type].color
                } flex items-center justify-center text-2xl flex-shrink-0`}>
                  {ITEM_TYPES[item.type].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-gray-800 truncate ${
                    item.completed ? 'line-through text-gray-500' : ''
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{ITEM_TYPES[item.type].label}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-medium ${
                    item.completed ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {new Date(item.deadline).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {sortedItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay elementos para mostrar</p>
              <button
                onClick={handleCreateItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Crear primer elemento
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Calendario Académico</h1>
              <p className="text-gray-600">Gestiona tus actividades, evaluaciones, cuestionarios y foros</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-500">
                  {items.length} elemento{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-lg font-bold text-green-600">{completedCount}</span>
                <span className="text-gray-500 text-sm"> / {totalCount} completadas</span>
              </div>
              {totalCount > 0 && (
                <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Calendario
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
              Lista
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Filter className="w-5 h-5" />
                Filtrar
                {filterType !== 'all' && (
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">1</span>
                )}
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => { setFilterType('all'); setIsFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      Todos
                    </button>
                    {Object.entries(ITEM_TYPES).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => { setFilterType(key); setIsFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          filterType === key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span>{value.icon}</span>
                        <span>{value.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear
            </button>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'calendar' ? renderCalendar() : renderListView()}

        {/* Detail Modal */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className={`${
                selectedItem.completed ? 'bg-gray-400' : ITEM_TYPES[selectedItem.type].color
              } p-6 rounded-t-lg`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{ITEM_TYPES[selectedItem.type].icon}</span>
                    <div>
                      <p className="text-white text-sm font-medium opacity-90">
                        {ITEM_TYPES[selectedItem.type].label}
                      </p>
                      <h3 className={`text-2xl font-bold text-white ${
                        selectedItem.completed ? 'line-through' : ''
                      }`}>
                        {selectedItem.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <button
                    onClick={() => handleToggleComplete(selectedItem.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedItem.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedItem.completed ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Completada
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5" />
                        Marcar como completada
                      </>
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Fecha límite</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(selectedItem.deadline).toLocaleDateString('es-ES', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                
                {selectedItem.description && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Descripción</p>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(selectedItem)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {editingItem ? 'Editar Elemento' : 'Crear Elemento'}
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Ej: Tarea de Matemáticas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {Object.entries(ITEM_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.icon} {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha límite *
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    rows="3"
                    placeholder="Descripción opcional del elemento"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitForm}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingItem ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}