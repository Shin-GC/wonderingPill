import Image from "next/image";
import {
  BUTTON_COLOR as BORDER_COLOR,
  FOOTER_HEIGHT,
  FULL_HEIGHT,
  HEADER_HEIGHT,
  MAIN_COLOR,
} from "@utils/constant";
import {
  ContentClip,
  ContentContainer,
  InnerContainer,
  Profile,
  SocialLoginState,
  UserInfo,
  UserInfoContainer,
  UserInfoItem,
  UserInfoItemCount,
  UserName,
  UserNameWrapper,
  UserState,
  UserStateWrapper,
} from "./MyPage.style";
import Container from "common/container/Container";
import Capture from "common/capture/Capture";

function MyPage() {
  return (
    <Container>
      <InnerContainer>
        <UserInfoContainer>
          <Profile>
            <Capture />
          </Profile>
          <UserInfo>
            <UserNameWrapper>
              <UserName $borderColor={BORDER_COLOR}>테스트 계정 님!</UserName>
              <SocialLoginState>카카오로그인</SocialLoginState>
            </UserNameWrapper>
            <UserStateWrapper>
              <UserState>
                <UserInfoItemCount>5</UserInfoItemCount>
                <UserInfoItem>복용약</UserInfoItem>
              </UserState>
              <UserState>
                <UserInfoItemCount>5</UserInfoItemCount>
                <UserInfoItem>복용약</UserInfoItem>
              </UserState>
              <UserState>
                <UserInfoItemCount>5</UserInfoItemCount>
                <UserInfoItem>복용약</UserInfoItem>
              </UserState>
            </UserStateWrapper>
          </UserInfo>
        </UserInfoContainer>
        <ContentContainer $borderColor={BORDER_COLOR}>
          <ContentClip $bgColor={BORDER_COLOR}>복용약</ContentClip>
        </ContentContainer>
        <ContentContainer $borderColor={BORDER_COLOR}>
          <ContentClip $bgColor={BORDER_COLOR}>관심 약국</ContentClip>
        </ContentContainer>
      </InnerContainer>
    </Container>
  );
}

export default MyPage;
