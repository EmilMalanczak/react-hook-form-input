export const logInputEvent = (
  eventName: string,
  inputName: string,
  data: unknown,
) => {
  console.info(
    `%cForm input ${eventName}`,
    "color: #7b7bed; display: block; width: 100%; margin-bottom: 8px;",
    `\ninput name: ${inputName}`,
    data,
  );
};
