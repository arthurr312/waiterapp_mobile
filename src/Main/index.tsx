import {
    Container,
    CategoriesContainer,
    MenuContainer,
    Footer,
    FooterContainer,
    CenteredContainer,
} from "./styles";
import { Header } from "../components/Header";
import { Categories } from "../components/Categories";
import { Menu } from "../components/Menu";
import { Button } from "../components/Button";
import { TableModal } from "../components/TableModal";
import { useState, useEffect } from "react";
import { Cart } from "../components/Cart";
import { CartItem } from "../types/CartItem";
import { Product } from "../types/Product";
import { ActivityIndicator } from "react-native";
import { Empty } from "../components/Icons/Empty";
import { Text } from "../components/Text";
import { Category } from "../types/Category";
import { api } from "../utils/api";

export function Main() {
    const [isTableModalVisible, setIsTableModalVisible] = useState(false);
    const [selectedTable, setSelectedTable] = useState("");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    useEffect(() => {
        //com o Promise.all, o response no then vira um array em que cada posição é de fato a resposta de uma req específica.
        Promise.all([api.get("/categories"), api.get("/products")]).then(
            ([categoriesResponse, productResponse]) => {
                setCategories(categoriesResponse.data);
                setProducts(productResponse.data);
                setIsLoading(false);
            }
        );
    }, []);

    async function handleSelectCategory(categoryId: string) {
        const route = !categoryId
            ? "/products"
            : `/categories/${categoryId}/products`;
        setIsLoadingProducts(true);
        const { data } = await api.get(route);
        setProducts(data);
        setIsLoadingProducts(false);
    }

    function handleCloseModal() {
        setIsTableModalVisible(false);
    }

    function onSave(table: string) {
        setSelectedTable(table);
    }

    function handleResetOrder() {
        setSelectedTable("");
        setCartItems([]);
    }

    function handleAddToCart(product: Product) {
        if (!selectedTable) {
            setIsTableModalVisible(true);
        }
        setCartItems((prevState) => {
            const itemIndex = prevState.findIndex(
                (cartItem) => cartItem.product._id === product._id
            );
            if (itemIndex < 0) {
                return prevState.concat({
                    quantity: 1,
                    product,
                });
            }
            const newCartItems = [...prevState];
            const item = newCartItems[itemIndex];
            newCartItems[itemIndex] = {
                ...item,
                quantity: item.quantity + 1,
            };
            return newCartItems;
        });
    }

    function handleDecrementCartItem(product: Product) {
        setCartItems((prevState) => {
            const itemIndex = prevState.findIndex(
                (cartItem) => cartItem.product._id === product._id
            );
            const item = prevState[itemIndex];
            const newCartItems = [...prevState];

            if (item.quantity === 1) {
                newCartItems.splice(itemIndex, 1);
                return newCartItems;
            }
            newCartItems[itemIndex] = {
                ...item,
                quantity: item.quantity - 1,
            };
            return newCartItems;
        });
    }

    return (
        <>
            <Container>
                <Header
                    selectedTable={selectedTable}
                    onCancelOrder={handleResetOrder}
                />
                {isLoading && (
                    <CenteredContainer>
                        <ActivityIndicator color="#d73035" size="large" />
                    </CenteredContainer>
                )}
                {!isLoading && (
                    <>
                        <CategoriesContainer>
                            <Categories
                                categories={categories}
                                onSelectCategory={handleSelectCategory}
                            />
                        </CategoriesContainer>
                        {isLoadingProducts ? (
                            <CenteredContainer>
                                <ActivityIndicator
                                    color="#d73035"
                                    size="large"
                                />
                            </CenteredContainer>
                        ) : (
                            <>
                                {products.length > 0 ? (
                                    <MenuContainer>
                                        <Menu
                                            products={products}
                                            onAddToCart={handleAddToCart}
                                        />
                                    </MenuContainer>
                                ) : (
                                    <CenteredContainer>
                                        <Empty />
                                        <Text
                                            color="#666"
                                            style={{ marginTop: 24 }}
                                        >
                                            Nenhum produto foi encontrado!
                                        </Text>
                                    </CenteredContainer>
                                )}
                            </>
                        )}
                    </>
                )}
            </Container>
            <Footer>
                <FooterContainer>
                    {!selectedTable && (
                        <Button
                            disabled={isLoading}
                            onPress={() => setIsTableModalVisible(true)}
                        >
                            Novo Pedido
                        </Button>
                    )}
                    {selectedTable && (
                        <Cart
                            onAdd={handleAddToCart}
                            onDecrement={handleDecrementCartItem}
                            cartItems={cartItems}
                            onConfirmOrder={handleResetOrder}
                            selectedTable={selectedTable}
                        />
                    )}
                </FooterContainer>
            </Footer>
            <TableModal
                onClose={handleCloseModal}
                visible={isTableModalVisible}
                onSave={onSave}
            />
        </>
    );
}
