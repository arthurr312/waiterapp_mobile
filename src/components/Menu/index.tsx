import { FlatList } from "react-native";
import { Text } from "../Text";
import {
    ProductContainer,
    ProductImage,
    ProductDetails,
    Separator,
    AddToCartButton,
} from "./styles";
import { formatCurrency } from "../../utils/formatCurrency";
import { PlusCircle } from "../Icons/PlusCircle";
import { ProductModal } from "../ProductModal";
import { useState } from "react";
import { Product } from "../../types/Product";

interface MenuProps {
    onAddToCart: (product: Product) => void;
    products: Product[];
}

export function Menu({ onAddToCart, products }: MenuProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );

    function handleOpenModal(product: Product) {
        setIsModalVisible(true);
        setSelectedProduct(product);
    }
    return (
        <>
            <ProductModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                product={selectedProduct}
                onAddToCart={onAddToCart}
            />
            <FlatList
                data={products}
                keyExtractor={(product) => product._id}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                ItemSeparatorComponent={Separator}
                style={{ marginTop: 32 }}
                renderItem={({ item: product }) => (
                    <ProductContainer onPress={() => handleOpenModal(product)}>
                        <ProductImage
                            source={{
                                uri: `http://192.168.18.14:3001/uploads/${product.imagePath}`,
                            }}
                        />
                        <ProductDetails>
                            <Text weight="600">{product.name}</Text>
                            <Text
                                size={14}
                                color="#666"
                                style={{ marginVertical: 8 }}
                            >
                                {product.description}
                            </Text>
                            <Text size={14} weight="600">
                                {formatCurrency(product.price)}
                            </Text>
                        </ProductDetails>
                        <AddToCartButton onPress={() => onAddToCart(product)}>
                            <PlusCircle />
                        </AddToCartButton>
                    </ProductContainer>
                )}
            />
        </>
    );
}
