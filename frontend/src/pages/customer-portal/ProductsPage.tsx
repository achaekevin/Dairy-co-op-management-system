import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiShoppingCart,
  HiMagnifyingGlass,
  HiXMark,
  HiPlus,
  HiMinus,
  HiCheckCircle,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { customerPortalService, type Product } from '../../services/customerPortalService';
import toast from 'react-hot-toast';

interface CartItem extends Product {
  quantity: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CREDIT'>('CASH');
  const [notes, setNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
    if (currentPage === 1) {
      fetchCategories();
    }
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await customerPortalService.getProducts({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });
      if (response.success && response.data) {
        const responseData = response.data as any;
        const productsData = responseData.data || response.data;
        setProducts(Array.isArray(productsData) ? productsData : []);
        
        if (responseData.meta) {
          setTotalPages(responseData.meta.totalPages || 1);
          setTotalProducts(responseData.meta.total || productsData.length);
        } else {
          setTotalPages(1);
          setTotalProducts(productsData.length);
        }
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await customerPortalService.getProductCategories();
      if (response.success && response.data) {
        const cats = response.data.map(c => ({
          value: c.category,
          label: `${c.category} (${c.productCount})`,
        }));
        setCategories([{ value: 'ALL', label: 'All Products' }, ...cats]);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.productName} added to cart`);
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        deliveryAddress,
        paymentMethod,
        notes: notes || undefined,
      };

      const response = await customerPortalService.placeOrder(orderData);
      if (response.success) {
        toast.success('Order placed successfully!');
        setCart([]);
        setShowCheckout(false);
        setShowCart(false);
        setDeliveryAddress('');
        setNotes('');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Browse Products
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Select products and add them to your cart
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCart(true)}
          className="relative"
        >
          <HiShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories}
          />
        </div>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">No products found</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="p-4 space-y-3">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.productName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('svg')) {
                              const icon = document.createElement('div');
                              icon.innerHTML = '<svg class="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>';
                              parent.appendChild(icon.firstElementChild!);
                            }
                          }}
                        />
                      ) : (
                        <HiShoppingCart className="w-16 h-16 text-slate-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                        {product.productName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {product.productCode}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant={product.status === 'AVAILABLE' ? 'success' : 'error'}>
                        {product.category}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Stock: {product.availableStock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          KSh {product.unitPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">per {product.unit}</p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={product.status !== 'AVAILABLE' || product.availableStock === 0}
                      className="w-full"
                    >
                      <HiPlus className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <HiChevronLeft className="w-5 h-5" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        if (totalPages <= 7) return true;
                        if (page === 1 || page === totalPages) return true;
                        if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                        return false;
                      })
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsis && (
                              <span className="px-2 text-slate-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`
                                w-10 h-10 rounded-lg font-medium transition-colors
                                ${currentPage === page
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }
                              `}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <HiChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Cart Modal */}
      <Modal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        title="Shopping Cart"
        size="lg"
      >
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <HiShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.productName}</h4>
                  <p className="text-sm text-slate-500">KSh {item.unitPrice} per {item.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <HiMinus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <HiPlus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">
                    KSh {(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  <HiXMark className="w-5 h-5" />
                </Button>
              </div>
            ))}

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600 dark:text-primary-400">
                  KSh {getTotalAmount().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCart(false)}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
                className="flex-1"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Checkout"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Delivery Address *
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Payment Method *
            </label>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              options={[
                { value: 'CASH', label: 'Cash on Delivery' },
                { value: 'MOBILE_MONEY', label: 'Mobile Money' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'CREDIT', label: 'Credit Account' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
            />
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 dark:text-slate-300">Subtotal:</span>
              <span className="font-semibold">KSh {getTotalAmount().toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-primary-600 dark:text-primary-400">
              <span>Total:</span>
              <span>KSh {getTotalAmount().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCheckout(false)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handlePlaceOrder}
              className="flex-1"
            >
              <HiCheckCircle className="w-5 h-5 mr-2" />
              Place Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
