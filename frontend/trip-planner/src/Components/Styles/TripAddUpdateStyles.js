import tw from "twin.macro";
import styled from "styled-components";

const Form = tw.form`mx-auto max-w-sm min-w-3/4 bg-purple-300 p-5 rounded mt-4 md:min-w-1/2 lg:min-w-1/3`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm  focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`tracking-wide font-semibold bg-primary-500 text-gray-100 w-3/12 py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 `}
  }
  .text {
    ${tw`ml-3`}
  }
`;


export {Form, Input, SubmitButton};