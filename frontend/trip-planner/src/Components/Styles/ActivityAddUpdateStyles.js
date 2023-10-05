import tw from "twin.macro";
import styled from "styled-components";
import { PrimaryButton } from "../helpers/Misc";



const DividerTextContainer = tw.div`ml-8 text-center flex flex-col`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto bg-purple-300 p-5 rounded mt-4 flex mb-4`;
const Input = tw.input`w-full rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm  focus:border-gray-400 focus:bg-white first:mt-0 p-2 mt-4`;
const SubmitButton = styled.button`
  ${tw`tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none mt-4`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

const TextArea = tw.textarea`h-24 sm:h-full resize-none rounded`;

const ButtonContainer = tw.div`flex justify-center`;
const LoadMoreButton = tw(PrimaryButton)`mt-16 mx-auto`;

export const ContentWithPaddingXl= tw.div`max-w-screen-xl mx-auto py-4`;

export {DividerTextContainer, DividerText, Form, Input, SubmitButton, TextArea, ButtonContainer, LoadMoreButton};