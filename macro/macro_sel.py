import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
import time

class TicketBookingAutomation:
    """
    A class to automate the process of booking tickets using Selenium WebDriver.
    """

    def __init__(self, driver_path, url, profile_path=None):
        """
        Initializes the TicketBookingAutomation instance.

        Parameters:
        - driver_path (str): The path to the ChromeDriver executable.
        - url (str): The URL of the ticket booking page.
        - profile_path (str, optional): The path to the Chrome user profile directory.
        """
        # Setting up logging
        # 로그 설정
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s [%(levelname)s] %(message)s',
            handlers=[
                logging.FileHandler("ticket_booking.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

        self.logger.info("Initializing the automation process.")
        # 자동화 프로세스를 초기화합니다.

        # Setting ChromeOptions to keep the browser open
        # 브라우저가 자동으로 닫히지 않도록 ChromeOptions 설정
        options = webdriver.ChromeOptions()
        options.add_experimental_option("detach", True)
        
        # Load the specified user profile if provided
        # 사용자 프로필 경로를 지정하여 프로필을 로드합니다.
        if profile_path:
            options.add_argument(f"user-data-dir={profile_path}")

        # Setting up ChromeDriver service
        # ChromeDriver 서비스 설정
        service = Service(executable_path=driver_path)

        # Initializing the WebDriver
        # 웹 드라이버 초기화
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 20)
        self.url = url

    def open_page(self):
        """
        Opens the specified URL in the browser and waits for the page to load completely.
        """
        self.logger.info(f"Opening the page: {self.url}")
        # 해당 웹 페이지로 이동
        self.driver.get(self.url)
        # 페이지 로딩이 완료될 때까지 대기
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
        self.logger.info("Page has loaded successfully.")
        # 페이지가 성공적으로 로드되었습니다.

    def click_booking_button(self):
        """
        Clicks the "예매하기" (Book Now) button to open the new UI for ticket booking.
        """
        self.logger.info("Clicking the booking button.")
        # "예매하기" 버튼을 클릭합니다.
        try:
            # Locate the parent element containing the "예매하기" button using XPath
            # XPath를 사용하여 "예매하기" 버튼이 포함된 부모 요소를 찾습니다.
            parent_div = self.wait.until(EC.presence_of_element_located(
                (By.XPATH, '//*[@id="movie"]/div/div/div[2]/div/div[1]/div[1]/div[2]/div')
            ))
            # Find and click the "예매하기" button within the parent element
            # 부모 요소 내의 "예매하기" 버튼을 찾고 클릭합니다.
            booking_button = parent_div.find_element(By.XPATH, './/button[text()="예매하기"]')
            booking_button.click()
            self.logger.info("Successfully clicked the booking button.")
            # 예매하기 버튼을 성공적으로 클릭했습니다.
        except Exception as e:
            self.logger.error(f"Unable to click the booking button: {e}")
            # 예매하기 버튼을 클릭할 수 없습니다.
            self.quit_driver()
            exit()

    def fill_form(self, user_data):
        """
        Fills out the form with the provided user data.

        Parameters:
        - user_data (dict): A dictionary containing user data such as User_ID, Password, etc.
        """
        self.logger.info("Filling out the form.")
        # 폼을 작성합니다.
        try:
            # Wait for the 'User_ID' input field to appear in the new UI
            # 새로운 UI 안에 있는 'User_ID' 입력 필드가 나타날 때까지 대기
            user_id_input = self.wait.until(EC.presence_of_element_located((By.NAME, 'User_ID')))
            user_id_input.send_keys(user_data['User_ID'])
            self.logger.info("Entered User_ID.")
            # User_ID를 입력했습니다.
        except Exception as e:
            self.logger.error(f"Unable to find the User_ID input field: {e}")
            # User_ID 입력 필드를 찾을 수 없습니다.
            self.quit_driver()
            exit()

        # Input other form fields
        # 다른 폼 필드 입력
        try:
            self.input_text('Password', user_data['Password'])
            self.logger.info("Entered Password.")
            # Password를 입력했습니다.

            self.clear_and_input('Transaction_Quantity', user_data['Transaction_Quantity'])
            self.logger.info("Entered Transaction_Quantity.")
            # Transaction_Quantity를 입력했습니다.

            self.input_text('Age', user_data['Age'])
            self.logger.info("Entered Age.")
            # Age를 입력했습니다.

            self.select_option('Payment_Method', user_data['Payment_Method'])
            self.logger.info("Selected Payment_Method.")
            # Payment_Method를 선택했습니다.

            self.select_option('Card_Type', user_data['Card_Type'])
            self.logger.info("Selected Card_Type.")
            # Card_Type을 선택했습니다.

            self.input_text('Card_Number', user_data['Card_Number'])
            self.logger.info("Entered Card_Number.")
            # Card_Number를 입력했습니다.
        except Exception as e:
            self.logger.error(f"Error while processing input fields: {e}")
            # 입력 필드를 처리하는 동안 오류가 발생했습니다.
            self.quit_driver()
            exit()

    def input_text(self, name, value):
        """
        Inputs text into a form field.

        Parameters:
        - name (str): The name attribute of the form field.
        - value (str): The value to input into the form field.
        """
        # Find the input field by name and enter the value
        # 이름으로 입력 필드를 찾아 값을 입력합니다.
        element = self.driver.find_element(By.NAME, name)
        element.send_keys(value)

    def clear_and_input(self, name, value):
        """
        Clears a form field and inputs new text.

        Parameters:
        - name (str): The name attribute of the form field.
        - value (str): The value to input into the form field.
        """
        # Find the input field, clear its content, and enter the new value
        # 입력 필드를 찾고, 내용을 지우고, 새 값을 입력합니다.
        element = self.driver.find_element(By.NAME, name)
        element.clear()
        element.send_keys(value)

    def select_option(self, name, value):
        """
        Selects an option from a dropdown menu.

        Parameters:
        - name (str): The name attribute of the select element.
        - value (str): The value of the option to select.
        """
        # Find the select element and choose the option by value
        # 선택 요소를 찾고 값으로 옵션을 선택합니다.
        select_element = self.driver.find_element(By.NAME, name)
        select = Select(select_element)
        select.select_by_value(value)

    def submit_form(self):
        """
        Submits the filled-out form by clicking the "예매하기" (Submit) button.
        """
        self.logger.info("Submitting the form.")
        # 폼을 제출합니다.
        try:
            submit_button = self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, '//*[@id="seat"]/div/div/div/button')
            ))
            submit_button.click()
            self.logger.info("Successfully clicked the submit button.")
            # 예매하기 버튼을 성공적으로 클릭했습니다.
        except Exception as e:
            self.logger.error(f"Unable to click the submit button: {e}")
            # 예매하기 버튼을 클릭할 수 없습니다.
            self.quit_driver()
            exit()

    def quit_driver(self):
        """
        Quits the WebDriver and closes the browser after a delay.
        """
        self.logger.info("Quitting the driver.")
        # 드라이버를 종료합니다.
        # Pause for a moment to review the results, if necessary
        # 필요한 경우 결과를 확인할 시간을 둡니다.
        time.sleep(5)
        self.driver.quit()


if __name__ == "__main__":
    # Path to the ChromeDriver executable
    # ChromeDriver 실행 파일 경로
    driver_path = 'C:\\Users\\jungih\\dev\\NFT_Ticket_Site\\chromedriver.exe'
    # URL of the ticket booking page
    # 티켓 예매 페이지의 URL
    url = 'http://localhost:3000/main'
    
    # Path to the Chrome user profile
    # 크롬 사용자 프로필 경로
    profile_path = 'C:\\Users\\jungih\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 2'

    # User data for form filling
    # 폼 작성에 사용할 사용자 데이터
    user_data = {
        'User_ID': 'testID',
        'Password': 'passWord',
        'Transaction_Quantity': '2',
        'Age': '16',
        'Payment_Method': 'Credit Card',
        'Card_Type': 'Credit',
        'Card_Number': '1234123412341234'
    }

    # Initialize the automation class and perform the booking process
    # 자동화 클래스를 초기화하고 예매 과정을 수행합니다.
    automation = TicketBookingAutomation(driver_path, url, profile_path)
    automation.open_page()
    
    automation.click_booking_button()
    for i in range(5):
        automation.fill_form(user_data)
        automation.submit_form()
    # Note: `quit_driver()` is not called here to keep the browser open after execution
    # 참고: 실행 후 브라우저를 열어 두기 위해 `quit_driver()`를 호출하지 않습니다.
