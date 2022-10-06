import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@atom/userAtom";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import * as Api from "@api";
import { CommonResponseDto as Response } from "@modelTypes/commonResponseDto";
import { SetAlarmDto as SetAlarmValues } from "@modelTypes/setAlarmDto";
import { GetAlarmSetResponseDto as GetAlarmResponse } from "@modelTypes/getAlarmSetResponseDto";
import { GetAlarmSetResponseDtoAlarm as GetAlarmValues } from "@modelTypes/getAlarmSetResponseDtoAlarm";
import {
  MAIN_COLOR,
  SEMI_ACCENT_COLOR,
  ROUTE,
  TOASTIFY,
} from "@utils/constant";
import { getToken } from "@utils/firebase";
import { toast } from "react-toastify";
import {
  ContentContainer,
  TitleContainer,
  TopLine,
  Title,
  LinkBtn,
  MessageContainer,
  NotificationForm,
  NotificationTitle,
  Hr,
  SubmitBtn,
} from "@messagesComp/setting/SetNotificationPage.style";
import Container from "@container/Container";
import Switch from "@messagesComp/setting/Switch";
import TimeForm, { SettingFormValues } from "@messagesComp/setting/TimeForm";
import RemindForm from "@messagesComp/setting/RemindForm";
import { ALARMS } from "@utils/endpoint";

interface SetNotificationPageProps {
  bookmarkId: string;
  setting: GetAlarmValues;
}

const SetNotificationPage: NextPage<SetNotificationPageProps> = ({
  bookmarkId,
  setting,
}) => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const [isNotificationToggle, setIsNotificationToggle] = useState(true);
  const [isRemindToggle, setIsRemindToggle] = useState(
    typeof setting.repeatTime === "number" && setting.repeatTime > 0,
  );
  const [isAfternoon, setIsAfternoon] = useState(
    typeof setting.hour === "number" && setting.hour >= 12,
  );
  const [vip, setVip] = useState<number[]>(
    typeof setting.vip === "object" ? setting.vip : [],
  );
  const [pillName, setPillName] = useState(
    typeof setting.pillName === "string" ? setting.pillName : "",
  );
  const [deviceToken, setDeviceToken] = useState("");

  const setAlarmMutation = useMutation(
    (data: SetAlarmValues) =>
      Api.post<Response, SetAlarmValues>(ALARMS.SET, data),
    {
      onSuccess: () => {
        toast.success(TOASTIFY.SAVE_ALARM);
        router.push(ROUTE.MY_PAGE);
      },
      onError: () => {
        toast.error(TOASTIFY.FAIL);
      },
    },
  );

  const cancelAlarmMutation = useMutation(
    () => Api.put(`/alarms/${bookmarkId}`),
    {
      onSuccess: () => {
        toast.success(TOASTIFY.CANCEL_ALARM);
        router.push(ROUTE.MY_PAGE);
      },
      onError: () => {
        toast.error(TOASTIFY.FAIL);
      },
    },
  );

  const initialValue: SettingFormValues = {
    hour: typeof setting.hour === "number" ? setting.hour : 0,
    minute: typeof setting.minute === "number" ? setting.minute : 0,
    repeatTime: typeof setting.repeatTime === "number" ? setting.repeatTime : 0,
  };

  const formik = useFormik({
    initialValues: initialValue,
    onSubmit: async (values) => {
      if (isNotificationToggle) {
        // 알림 세팅
        const { hour, repeatTime, minute } = values;
        const dataToSubmit: SetAlarmValues = {
          pillBookmarkId: bookmarkId,
          deviceToken,
          vip,
          minute,
          hour: isAfternoon && hour < 12 ? hour + 12 : hour,
          pillName,
          userName: typeof user.name === "string" ? user.name : "",
          repeatTime: isRemindToggle ? repeatTime : 0,
        };
        setAlarmMutation.mutate(dataToSubmit);
      } else {
        // 알림 취소
        cancelAlarmMutation.mutate();
      }
    },
  });

  useEffect(() => {
    async function getDeviceToken() {
      const temp = await getToken();
      if (temp !== null) {
        setDeviceToken(temp);
      }
    }
    getDeviceToken();
  }, []);

  return (
    <Container>
      <ContentContainer onSubmit={formik.handleSubmit}>
        <TitleContainer>
          <TopLine $bgColor={SEMI_ACCENT_COLOR} />
          <Title $txtColor={SEMI_ACCENT_COLOR}>{pillName}</Title>
          <Link href={ROUTE.SEARCH_RESULT_PILLNAME(pillName)}>
            <LinkBtn $txtColor={MAIN_COLOR}>알약 상세 정보 보러가기 →</LinkBtn>
          </Link>
        </TitleContainer>
        <MessageContainer $borderColor={MAIN_COLOR}>
          <NotificationForm>
            <NotificationTitle $txtColor={SEMI_ACCENT_COLOR}>
              푸시 알림 설정{" "}
              <Switch
                isToggle={isNotificationToggle}
                setIsToggle={setIsNotificationToggle}
              />
            </NotificationTitle>
            <Hr $borderColor={SEMI_ACCENT_COLOR} />
          </NotificationForm>
          <TimeForm
            disabled={!isNotificationToggle}
            isAfternoon={isAfternoon}
            values={formik.values}
            vip={vip}
            onChange={formik.handleChange}
            setVip={setVip}
            setIsAfternoon={setIsAfternoon}
          />
          <RemindForm
            disabled={!isNotificationToggle}
            isRemindToggle={isRemindToggle}
            repeatTime={formik.values.repeatTime}
            setIsRemindToggle={setIsRemindToggle}
            onChange={formik.handleChange}
          />
        </MessageContainer>
        <SubmitBtn type="submit" $btnColor={MAIN_COLOR}>
          저장하기
        </SubmitBtn>
      </ContentContainer>
    </Container>
  );
};

export default SetNotificationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const bookmarkId = context.query.id;
  const token = context.req.cookies["AccessToken"] || null;

  if (!token) {
    return {
      redirect: { destination: ROUTE.MAIN, permanent: false },
      props: {},
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}${ALARMS.SET_ID(bookmarkId)}`,
    {
      headers: {
        Cookie: `AccessToken=${token}`,
      },
    },
  );

  if (!res.ok) {
    return {
      redirect: { destination: ROUTE.MAIN, permanent: false },
      props: {},
    };
  }

  const result: GetAlarmResponse = await res.json();

  return {
    props: {
      bookmarkId,
      setting: result.alarm,
    },
  };
};
