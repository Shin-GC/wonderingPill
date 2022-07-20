import { BUTTON_COLOR, SUB_COLOR } from "@utils/constant";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { CreateUserDto } from "src/model";
import * as Yup from "yup";
import {
  ErrorMessage,
  Form,
  Input,
  SelfAuthenticationLine,
  SubmitButton,
} from "./RegisterForm.style";

interface RegisterValues {
  email: string;
  name: string;
  password: string;
  checkPassword: string;
  birth: string;
}

const userInitialValue: RegisterValues = {
  email: "",
  name: "",
  password: "",
  checkPassword: "",
  birth: "",
};

const postRegisterAPI = async () => {
  const res = await fetch("http://localhost:5000/auth/signup");
  const result = res.json();
  return result;
};

function UserDataForm() {
  const mutation = useMutation(postRegisterAPI, {
    onSuccess: (data, variables) => {
      console.log("data : ", data);
    },
  });

  const userDataFormik = useFormik({
    initialValues: userInitialValue,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("이메일을 확인 해 주세요")
        .required("필수 입력 란입니다."),
      name: Yup.string()
        .max(20, "20자 이하로 입력 해 주세요.")
        .required("필수 입력 란입니다."),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "소문자, 숫자, 특수문자 포함 8자 이상입니다.",
        )
        .required("필수 입력 란입니다."),
      checkPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
        .required("필수 입력 란입니다."),
      birth: Yup.string()
        .matches(
          /(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/,
          "생년월일을 확인해주세요.",
        )
        .required("필수 입력 란입니다."),
    }),
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      mutation.mutate(values);
    },
  });

  return (
    <Form onSubmit={userDataFormik.handleSubmit}>
      <Input
        id="email"
        type="email"
        {...userDataFormik.getFieldProps("email")}
        placeholder="이메일"
      />
      {userDataFormik.touched.email && userDataFormik.errors.email ? (
        <ErrorMessage>{userDataFormik.errors.email}</ErrorMessage>
      ) : (
        <ErrorMessage />
      )}

      <Input
        id="name"
        type="text"
        {...userDataFormik.getFieldProps("name")}
        placeholder="이름"
      />
      {userDataFormik.touched.name && userDataFormik.errors.name ? (
        <ErrorMessage>{userDataFormik.errors.name}</ErrorMessage>
      ) : (
        <ErrorMessage />
      )}

      <Input
        id="password"
        type="password"
        {...userDataFormik.getFieldProps("password")}
        placeholder="비밀번호"
      />
      {userDataFormik.touched.password && userDataFormik.errors.password ? (
        <ErrorMessage>{userDataFormik.errors.password}</ErrorMessage>
      ) : (
        <ErrorMessage />
      )}

      <Input
        id="checkPassword"
        type="password"
        {...userDataFormik.getFieldProps("checkPassword")}
        placeholder="비밀번호 확인"
      />
      {userDataFormik.touched.checkPassword &&
      userDataFormik.errors.checkPassword ? (
        <ErrorMessage>{userDataFormik.errors.checkPassword}</ErrorMessage>
      ) : (
        <ErrorMessage />
      )}

      <Input
        id="birth"
        type="number"
        {...userDataFormik.getFieldProps("birth")}
        placeholder="생년월일(8자리)"
      />
      {userDataFormik.touched.birth && userDataFormik.errors.birth ? (
        <ErrorMessage>{userDataFormik.errors.birth}</ErrorMessage>
      ) : (
        <ErrorMessage />
      )}

      <SelfAuthenticationLine $lineColor={SUB_COLOR}>
        본인 인증
      </SelfAuthenticationLine>

      <SubmitButton type="submit" $btnColor={BUTTON_COLOR}>
        회원가입하기
      </SubmitButton>
    </Form>
  );
}

export default UserDataForm;
