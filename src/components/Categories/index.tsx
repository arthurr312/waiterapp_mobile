import { Text } from "../Text";
import { Category, Icon } from "./styles";
import { categories } from "../../mocks/categories";
import { FlatList } from "react-native";
import { useState } from "react";

export function Categories() {
    const [selectedCategory, setSelectedCategory] = useState("");
    function handleSelecteCategory(categoryId: string) {
        const category = selectedCategory === categoryId ? "" : categoryId;
        setSelectedCategory(category);
    }
    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
            data={categories}
            keyExtractor={(category) => category._id}
            renderItem={({ item: category }) => {
                const isSelected = selectedCategory === category._id;
                return (
                    <Category
                        onPress={() => handleSelecteCategory(category._id)}
                    >
                        <Icon>
                            <Text opacity={isSelected ? 1 : 0.5}>
                                {category.icon}
                            </Text>
                        </Icon>
                        <Text
                            opacity={isSelected ? 1 : 0.5}
                            size={14}
                            weight="600"
                        >
                            {category.name}
                        </Text>
                    </Category>
                );
            }}
        />
    );
}
