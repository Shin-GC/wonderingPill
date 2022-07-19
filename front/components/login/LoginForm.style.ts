import { styled } from "styletron-react";

export const LoginFormContainer = styled("div", {
  display: "grid",
  gridTemplateRows: "3fr 1fr",
});

export const Form = styled("form", {
  display: "grid",
  gridTemplateRows: "4fr 1fr",
  alignItems: "center",
});

export const ContentContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const InputContainer = styled("div", {
  width: "100%",
  display: "grid",
  gridTemplateRows: "2.1fr 1fr",
  justifyItems: "center",
});

export const Input = styled("input", {
  width: "65%",
  height: "3.5rem",
  border: 0,
  borderRadius: "25px",
  fontSize: "1rem",
  padding: "0 1rem",
  "::-webkit-input-placeholder": {
    textAlign: "center",
    fontFamily: "'Noto Sans KR', sans-serif",
    color: "#A4A4A4",
  },
});

export const ErrorMessage = styled("div", (props: { $txtColor: string }) => ({
  textAlign: "start",
  width: "65%",
  padding: "0.3rem 1rem",
  color: props.$txtColor,
  fontSize: "0.9rem",
}));

export const SubmitBtn = styled("button", (props: { $btnColor: string }) => ({
  width: "65%",
  height: "3.5rem",
  border: 0,
  borderRadius: "25px",
  fontSize: "1rem",
  backgroundColor: props.$btnColor,
  color: "#fff",
  fontWeight: "bold",
}));

export const SubBtnContainer = styled("div", {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  width: "80%",
  margin: "0 auto",
  color: "#fff",
});

export const CheckboxContainer = styled("div", {
  color: "#fff",
  fontSize: "0.9rem",
});

export const TextBtn = styled("button", {
  border: 0,
  backgroundColor: "transparent",
  color: "#fff",
  fontSize: "0.9rem",
});

export const SnsLoginContainer = styled("div", {
  display: "grid",
  gridTemplateRows: "1fr 1.5fr",
});

export const SnsTitle = styled("div", {
  display: "flex",
  flexBasis: "100%",
  alignItems: "center",
  fontSize: "1rem",
  color: "#fff",
  ":before": {
    content: "''",
    flexGrow: 1,
    backgroundColor: "#fff",
    height: "1px",
    fontSize: "0px",
    lineHeight: "0px",
    margin: "0 1.5rem",
  },
  ":after": {
    content: "''",
    flexGrow: 1,
    backgroundColor: "#fff",
    height: "1px",
    fontSize: "0px",
    lineHeight: "0px",
    margin: "0 1.5rem",
  },
});

export const SnsBtnContainer = styled("div", {
  width: "30%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0 auto",
});

export const KakaoBtn = styled("div", {
  width: "45px",
  height: "45px",
  border: 0,
  backgroundColor: "#FEE500",
  borderRadius: "5px",
});

export const GoogleBtn = styled("button", {
  width: "45px",
  height: "45px",
  backgroundColor: "#fff",
  border: 0,
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
