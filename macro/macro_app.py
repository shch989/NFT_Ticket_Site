import sys
import time
import logging
import keyboard
import traceback
import pyautogui

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

class MacroDialog(QDialog):
    def __init__(self):
        """
        Initialize the MacroDialog class.

        Sets up the user interface, initializes internal variables, and configures global hotkeys for starting and stopping the macro.

        MacroDialog 클래스를 초기화합니다.

        사용자 인터페이스를 설정하고, 내부 변수를 초기화하며, 매크로 시작과 정지를 위한 글로벌 핫키를 구성합니다.
        """
        super().__init__()
        # Initialize the UI
        # UI 초기화
        self.setupUi()
        
        # Initialize internal variables
        # 내부 변수 초기화
        self.command = []  # List of commands / 명령어 리스트
        self.is_excution = False  # Macro execution state / 매크로 실행 상태
        self.time_delay = 0  # Time delay value / 시간 지연 값
        
        # Setup global hotkeys
        # 글로벌 핫키 설정
        keyboard.add_hotkey('f3', self.MacroStartButtonHandler)  # F3 to start macro / F3로 매크로 시작
        keyboard.add_hotkey('f4', self.MacroStopButtonHandler)   # F4 to stop macro / F4로 매크로 중지

    def setupUi(self):
        """
        Set up the UI components and layouts.

        Creates and configures all the UI elements, connects event handlers, and initializes timers.

        UI 구성 요소와 레이아웃을 설정합니다.

        모든 UI 요소를 생성하고 구성하며, 이벤트 핸들러를 연결하고 타이머를 초기화합니다.
        """
        self.setObjectName("Dialog")
        self.resize(601, 351)  # Set dialog size / 다이얼로그 크기 설정
        
        # Create and set UI elements
        # UI 요소 생성 및 설정
        self.FileOpenButton = QPushButton(self)
        self.FileOpenButton.setGeometry(QRect(290, 40, 191, 61))
        self.FileOpenButton.setObjectName("FileOpenButton")
        
        self.CommandListView = QListView(self)
        self.CommandListView.setGeometry(QRect(20, 40, 251, 291))
        self.CommandListView.setObjectName("CommandListView")
        
        self.MacroStartButton = QPushButton(self)
        self.MacroStartButton.setGeometry(QRect(500, 40, 75, 21))
        self.MacroStartButton.setObjectName("MacroStartButton")
        
        self.MacroStopButton = QPushButton(self)
        self.MacroStopButton.setGeometry(QRect(500, 80, 75, 21))
        self.MacroStopButton.setObjectName("MacroStopButton")
        
        self.TimeDelayDoubleSpinBox = QDoubleSpinBox(self)
        self.TimeDelayDoubleSpinBox.setGeometry(QRect(290, 140, 191, 22))
        self.TimeDelayDoubleSpinBox.setDecimals(1)
        self.TimeDelayDoubleSpinBox.setSingleStep(0.1)
        self.TimeDelayDoubleSpinBox.setObjectName("TimeDelayDoubleSpinBox")
        
        self.TimeDelayInsert = QPushButton(self)
        self.TimeDelayInsert.setGeometry(QRect(500, 140, 75, 21))
        self.TimeDelayInsert.setObjectName("TimeDelayInsert")
        
        self.TimeDelayLabel = QLabel(self)
        self.TimeDelayLabel.setGeometry(QRect(290, 120, 101, 16))
        self.TimeDelayLabel.setObjectName("TimeDelayLabel")
        
        self.DateReservationEdit = QDateEdit(self)
        self.DateReservationEdit.setGeometry(QRect(290, 200, 121, 22))
        self.DateReservationEdit.setObjectName("DateReservationEdit")
        self.DateReservationEdit.setDate(QDate.currentDate())
        
        self.TimeReservationEdit = QTimeEdit(self)
        self.TimeReservationEdit.setGeometry(QRect(290, 260, 121, 22))
        self.TimeReservationEdit.setObjectName("TimeReservationEdit")
        self.TimeReservationEdit.setTime(QTime.currentTime())
        
        self.ReservationCheckBox = QCheckBox(self)
        self.ReservationCheckBox.setGeometry(QRect(430, 200, 141, 16))
        self.ReservationCheckBox.setObjectName("ReservationCheckBox")
        
        self.MacroProgressBar = QProgressBar(self)
        self.MacroProgressBar.setGeometry(QRect(290, 310, 291, 23))
        self.MacroProgressBar.setProperty("value", 0)
        self.MacroProgressBar.setObjectName("MacroProgressBar")
        
        # Create and set labels
        # 레이블 생성 및 설정
        self.FileOpenLabel = QLabel(self)
        self.FileOpenLabel.setGeometry(QRect(290, 20, 101, 16))
        self.FileOpenLabel.setObjectName("FileOpenLabel")
        
        self.CommandListLabel = QLabel(self)
        self.CommandListLabel.setGeometry(QRect(20, 20, 101, 16))
        self.CommandListLabel.setObjectName("CommandListLabel")
        
        self.DateReservationLabel = QLabel(self)
        self.DateReservationLabel.setGeometry(QRect(290, 180, 101, 16))
        self.DateReservationLabel.setObjectName("DateReservationLabel")
        
        self.TimeReservationLabel = QLabel(self)
        self.TimeReservationLabel.setGeometry(QRect(290, 240, 101, 16))
        self.TimeReservationLabel.setObjectName("TimeReservationLabel")
        
        # Timer setup (for scheduled tasks)
        # 타이머 설정 (예약 작업에 사용)
        self.timer = QTimer(self)
        
        # Set the model for the list view
        # 리스트 뷰에 모델 설정
        self.CommandListView.setModel(QStandardItemModel())
        
        # Connect event handlers
        # 이벤트 핸들러 연결
        self.FileOpenButton.clicked.connect(self.FileOpenEventHandler)
        self.MacroStartButton.clicked.connect(self.MacroStartButtonHandler)
        self.MacroStopButton.clicked.connect(self.MacroStopButtonHandler)
        self.TimeDelayInsert.clicked.connect(self.TimeDelayInsertHandler)
        self.ReservationCheckBox.stateChanged.connect(self.ReservationCheckBoxHandler)
        
        # Set the timer (10ms interval)
        # 타이머 설정 (10ms 간격)
        self.timer.setInterval(10)
        self.timer.timeout.connect(self.ReservationTimerEventHandler)
        
        # Set UI text labels
        # UI 텍스트 레이블 설정
        self.retranslateUi()

    def retranslateUi(self):
        """
        Set the text for UI elements.

        Translates and sets the text for buttons, labels, and other UI components.

        UI 요소의 텍스트를 설정합니다.

        버튼, 레이블 및 기타 UI 구성 요소의 텍스트를 번역하여 설정합니다.
        """
        _translate = QCoreApplication.translate
        self.setWindowTitle(_translate("Dialog", "Dialog"))
        self.FileOpenButton.setText(_translate("Dialog", "File Open"))
        self.MacroStartButton.setText(_translate("Dialog", "Start(F3)"))
        self.MacroStopButton.setText(_translate("Dialog", "Stop(F4)"))
        self.TimeDelayLabel.setText(_translate("Dialog", "Time Delay(ms)"))
        self.TimeDelayInsert.setText(_translate("Dialog", "Insert"))
        self.CommandListLabel.setText(_translate("Dialog", "Command List"))
        self.FileOpenLabel.setText(_translate("Dialog", "File Open"))
        self.DateReservationLabel.setText(_translate("Dialog", "Date Reservation"))
        self.TimeReservationLabel.setText(_translate("Dialog", "Time Reservation"))
        self.ReservationCheckBox.setText(_translate("Dialog", "      Reservation"))

    def FileOpenEventHandler(self):
        """
        Handle the event when the 'File Open' button is clicked.

        Opens a file dialog to select a text file, reads the file content, and populates the command list.

        '파일 열기' 버튼이 클릭되었을 때의 이벤트를 처리합니다.

        파일 선택 대화상자를 열어 텍스트 파일을 선택하고, 파일 내용을 읽어 명령어 리스트를 채웁니다.
        """
        # Open file dialog
        # 파일 열기 대화상자
        file = QFileDialog.getOpenFileName(self, "File Open", "C:/Users/user/dev/NFT_Ticket_Site", "*.txt")

        if file[0]:  # Check if a file was selected / 파일이 선택되었는지 확인
            with open(file[0], "r", encoding="UTF-8") as f:
                model = self.CommandListView.model()
                model.clear()
                
                # Add file contents to the command list
                # 파일 내용을 명령어 리스트에 추가
                for text in f:
                    model.appendRow(QStandardItem(text))
                    self.command.append(text)
                
    def MacroStartButtonHandler(self):
        """
        Start the macro execution.

        Sets the execution flag to True and calls the macro function.

        매크로 실행을 시작합니다.

        실행 플래그를 True로 설정하고 매크로 함수를 호출합니다.
        """
        self.is_excution = True  # Set execution flag to True / 실행 플래그를 True로 설정
        self.macro()  # Directly call the macro function / 매크로 함수 직접 호출
        
    def MacroStopButtonHandler(self):
        """
        Stop the macro execution.

        Sets the execution flag to False to halt the macro operation.

        매크로 실행을 중지합니다.

        실행 플래그를 False로 설정하여 매크로 작업을 중단합니다.
        """
        self.is_excution = False  # Set execution flag to False to stop the macro / 매크로 중지 위해 실행 플래그를 False로 설정

    def TimeDelayInsertHandler(self):
        """
        Insert the time delay value.

        Retrieves the value from the spin box and sets the time delay for macro actions.

        시간 지연 값을 삽입합니다.

        스핀 박스에서 값을 가져와 매크로 동작의 시간 지연을 설정합니다.
        """
        self.time_delay = self.TimeDelayDoubleSpinBox.value()
        print(f"Set time delay: {self.time_delay}")
        
    def ReservationCheckBoxHandler(self):    
        """
        Handle the state change of the reservation checkbox.

        Starts or stops the timer based on whether the checkbox is checked.

        예약 체크박스의 상태 변화를 처리합니다.

        체크박스가 선택되었는지 여부에 따라 타이머를 시작하거나 중지합니다.
        """
        is_checked = self.ReservationCheckBox.isChecked()

        # Start the timer if the reservation checkbox is checked
        # 예약 체크박스가 체크되면 타이머 시작
        if is_checked:
            self.timer.start()
            print("Timer started")
        else:
            self.timer.stop()
            print("Timer OFF")
            
    def ReservationTimerEventHandler(self):
        """
        Handle the timer event for reservation.

        Checks if the current date and time match the reserved date and time, and starts the macro if they match.

        예약을 위한 타이머 이벤트를 처리합니다.

        현재 날짜와 시간이 예약된 날짜와 시간과 일치하는지 확인하고, 일치하면 매크로를 시작합니다.
        """
        # Get the current date and time
        # 현재 날짜와 시간 가져오기
        current_date = QDate.currentDate()
        current_time = QTime.currentTime()

        # Check if the current date and time match the reservation
        # 현재 날짜와 시간이 예약된 것과 일치하는지 확인
        is_today = current_date == self.DateReservationEdit.date()
        is_now = current_time >= self.TimeReservationEdit.time()  # Ensure time has passed or is equal / 시간이 지났거나 같은지 확인

        if is_today and is_now:
            print("Executing macro - Date and time match")
            self.timer.stop()  # Stop the timer to prevent repeated execution / 중복 실행 방지를 위해 타이머 정지
            self.is_excution = True
            self.macro()  # Call the macro function / 매크로 함수 호출
        else:
            print(f"Waiting for reservation - Current Date: {current_date}, Time: {current_time}")
        
    def macro(self):
        """
        Execute the automation tasks according to the commands.

        Performs a series of GUI automation steps, updating the progress bar after each step.

        명령에 따라 자동화 작업을 실행합니다.

        일련의 GUI 자동화 단계를 수행하며, 각 단계 후에 프로그레스 바를 업데이트합니다.
        """
        try:
            # Calculate total steps and initialize the progress bar
            # 전체 단계 수를 계산하고 프로그레스 바를 초기화
            total_steps = 10  # 총 10단계로 설정 (각 작업에 해당)
            self.MacroProgressBar.setMaximum(total_steps)
            self.MacroProgressBar.setValue(0)
            
            step = 0  # Initialize the current step / 현재 단계 초기화
            
            while self.is_excution:
                # Move to and click the "Purchase Ticket" button
                # "예매하기" 버튼으로 이동하여 클릭
                pyautogui.moveTo(2150, 818)
                pyautogui.click()
                pyautogui.write(self.command[0])
                step += 1
                self.MacroProgressBar.setValue(step)  # Progress bar update / 프로그레스 바 업데이트
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the ID input field, then enter the command
                # ID 입력 필드로 이동하여 클릭한 후 명령어 입력
                pyautogui.moveTo(2775, 525)
                pyautogui.click()
                pyautogui.write(self.command[0])
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the password input field, then enter the command
                # 비밀번호 입력 필드로 이동하여 클릭한 후 명령어 입력
                pyautogui.moveTo(2775, 605)
                pyautogui.click()
                pyautogui.write(self.command[1])
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the amount input field, double-click to select all, then enter the command
                # 개수 입력 필드로 이동하여 클릭 후 더블 클릭하여 모두 선택한 후 명령어 입력
                pyautogui.moveTo(2775, 695)
                pyautogui.click()
                time.sleep(0.05)
                pyautogui.doubleClick()
                pyautogui.write(self.command[2])
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the age input field, then enter the command
                # 나이 입력 필드로 이동하여 클릭한 후 명령어 입력
                pyautogui.moveTo(2775, 780)
                pyautogui.click()
                pyautogui.write(self.command[3])
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Select the payment method
                # 결제 방법 선택
                pyautogui.moveTo(2775, 865)
                pyautogui.click()
                pyautogui.moveTo(2775, 923)
                pyautogui.click()
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Select the card category
                # 카드 종류 선택
                pyautogui.moveTo(2775, 953)
                pyautogui.click()
                pyautogui.moveTo(2775, 1010)
                pyautogui.click()
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the card number input field, then enter the command
                # 카드 번호 입력 필드로 이동하여 클릭한 후 명령어 입력
                pyautogui.moveTo(2775, 1045)
                pyautogui.click()
                pyautogui.write(self.command[4])
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the "Buy Ticket" button
                # "티켓 구매" 버튼으로 이동하여 클릭
                pyautogui.moveTo(2775, 1100)
                pyautogui.click()
                step += 1
                self.MacroProgressBar.setValue(step)
                time.sleep(self.time_delay)
                if not self.is_excution: break
                
                # Move to and click the "Transaction confirm" button
                # "트랜젝션 컨펌" 버튼으로 이동하여 클릭
                pyautogui.moveTo(3317, 603)
                pyautogui.click()
                step += 1
                self.MacroProgressBar.setValue(step)
                self.is_excution = False  # Reset the execution flag when the macro is finished / 매크로가 완료되면 실행 플래그 재설정
        finally:
            self.is_excution = False  # Ensure the execution flag is reset / 실행 플래그가 재설정되도록 보장
            print("Macro finished")


if __name__ == "__main__":
    
    # Logging setup (logs errors to a file)
    # 로깅 설정 (오류를 파일에 기록)
    logging.basicConfig(filename='./error.log', level=logging.ERROR)
    
    try:
        # Run the application and main dialog
        # 애플리케이션 및 메인 다이얼로그 실행
        app = QApplication(sys.argv)
        dialog = MacroDialog()
        dialog.show()
        sys.exit(app.exec_())
        
    except:
        # Log any exceptions that occur
        # 발생하는 예외를 로그로 기록
        from datetime import datetime
        logging.error(datetime.now())
        logging.error(traceback.format_exc())
