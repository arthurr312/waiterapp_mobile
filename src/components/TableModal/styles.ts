import styled from "styled-components/native";

// KeyboardAvoidingView - faz com que o teclado não comprometa a visualização da view em questão
export const Overlay = styled.KeyboardAvoidingView`
    background: rgba(0, 0, 0, 0.6);
    flex: 1;
    //stretch - estica filhos para seus respectivos containers ocuparem 100% da largura
    align-items: stretch;
    justify-content: center;
    padding: 0 24px;
`;

export const ModalBody = styled.View`
    background: #fafafa;
    border-radius: 8px;
    padding: 24px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const Form = styled.View`
    margin-top: 32px;
`;

export const Input = styled.TextInput`
    background: #fff;
    border: 1px solid rgba(204, 204, 204, 0.5);
    border-radius: 5px;
    padding: 12px;
    margin-bottom: 24px;
`;
