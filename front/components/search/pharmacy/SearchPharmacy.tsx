import { useState } from "react";
import * as Api from "@api";
import { useQuery } from "react-query";
import { pharmKeys } from "@utils/queryKey";
import { PharmacySearchResponseDto as PharmacyResponse } from "@modelTypes/pharmacySearchResponseDto";
import { PharmacySearchResponse as PharmacyValues } from "@modelTypes/pharmacySearchResponse";
import { isWideDevice } from "@utils/isWideDevice";
import {
  FOOTER_HEIGHT,
  FULL_HEIGHT,
  HEADER_HEIGHT,
  MAIN_COLOR,
  BOX_COLOR,
  GREEN_COLOR,
  YELLOW_COLOR,
  RED_COLOR,
} from "@utils/constant";
import {
  PageContainer,
  SearchPharmContainer,
  SearchContainer,
  SearchSelect,
  SearchOption,
  SearchInput,
  SearchBtn,
  PharmListBox,
  PharmListBoxHeader,
  Dot,
  PharmListBoxBody,
} from "./SearchPharmPage.style";
import KakaoMap from "./KakaoMap";
import PharmList from "./PharmList";
import { PHARMACY } from "@utils/endpoint";

function SearchPharmacy() {
  const isWide = isWideDevice();

  const [option, setOption] = useState("address");
  const [inputText, setInputText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isSubmitBtnClicked, setIsSubmitBtnClicked] = useState(false);
  const [pharmList, setPharmList] = useState<PharmacyValues[]>([]);

  useQuery(
    pharmKeys.searchPharm,
    () => Api.get<PharmacyResponse>(PHARMACY.SEARCH(option, keyword)),
    {
      enabled: !!keyword && isSubmitBtnClicked,
      onSuccess: (data) => {
        setIsSubmitBtnClicked(false);
        setPharmList(data.pharmacies);
      },
    },
  );

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOption(e.target.value);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitBtnClicked(true);
    setKeyword(inputText);
  };

  return (
    <PageContainer
      $headerHeight={HEADER_HEIGHT}
      $footerHeight={FOOTER_HEIGHT}
      $fullHeight={FULL_HEIGHT}>
      <SearchPharmContainer $bgColor={BOX_COLOR}>
        <SearchContainer onSubmit={onSubmitHandler}>
          <SearchSelect $bgColor={MAIN_COLOR} onChange={selectChangeHandler}>
            <SearchOption value="address">지역</SearchOption>
            <SearchOption value="name">이름</SearchOption>
          </SearchSelect>
          <SearchInput
            type="text"
            value={inputText}
            onChange={inputChangeHandler}
          />
          <SearchBtn type="submit" $bgColor={MAIN_COLOR}>
            검색
          </SearchBtn>
        </SearchContainer>

        <KakaoMap pharmList={pharmList} />
      </SearchPharmContainer>
      <PharmListBox $bgColor={MAIN_COLOR}>
        <PharmListBoxHeader $isWide={isWide}>
          <Dot $bgColor={RED_COLOR} />
          <Dot $bgColor={YELLOW_COLOR} />
          <Dot $bgColor={GREEN_COLOR} />
        </PharmListBoxHeader>
        <PharmListBoxBody>
          {pharmList.length > 0 && <PharmList pharmList={pharmList} />}
        </PharmListBoxBody>
      </PharmListBox>
    </PageContainer>
  );
}

export default SearchPharmacy;
