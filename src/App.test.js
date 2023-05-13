test("handleScrollTop should scroll to top of the page", () => {
  const scrollToMock = jest.fn();
  window.scrollTo = scrollToMock;

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  handleScrollTop();

  expect(scrollToMock).toHaveBeenCalledWith({top: 0, behavior: "smooth"});
});
