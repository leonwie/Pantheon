import time
import math
import smbus
bus = smbus.SMBus(1)

AIRFLOW_ADDRESS = 0x48 #address of the ADS1115
AIRFLOW_CONFIG_POINTER = 0x01
AIRFLOW_CONV_POINTER = 0x00
AIRFLOW_CONFIG_DATA = [0BMP280_data0000010, 0BMP280_data0000011] #all default except change to continuous conversion mode

bus.write_i2c_block_data(AIRFLOW_ADDRESS, AIRFLOW_CONFIG_POINTER, AIRFLOW_CONFIG_DATA) #write the CONFIG_DATA to the ADS1115


def read_pressure_and_temp_data(): #Based on code from https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BMP280-DS001.pdf and https://github.com/ControlEverythingCommunity/BMP280/blob/master/Python/BMP280.py
    BMP280_data = bus.read_i2c_block_data(0x77, 0x88, 24) #Read data back from pressure sensor with i2c address 0x77, register 0x88(136), 24 bytes

    # Convert the data
    # Temp coefficents
    dig_T1 = BMP280_data[1] * 256 + BMP280_data[0]
    dig_T2 = BMP280_data[3] * 256 + BMP280_data[2]
    if dig_T2 > 32767 :
        dig_T2 -= 65536
    dig_T3 = BMP280_data[5] * 256 + BMP280_data[4]
    if dig_T3 > 32767 :
        dig_T3 -= 65536

    # Pressure coefficents
    dig_P1 = BMP280_data[7] * 256 + BMP280_data[6]
    dig_P2 = BMP280_data[9] * 256 + BMP280_data[8]
    if dig_P2 > 32767 :
        dig_P2 -= 65536
    dig_P3 = BMP280_data[11] * 256 + BMP280_data[10]
    if dig_P3 > 32767 :
        dig_P3 -= 65536
    dig_P4 = BMP280_data[13] * 256 + BMP280_data[12]
    if dig_P4 > 32767 :
        dig_P4 -= 65536
    dig_P5 = BMP280_data[15] * 256 + BMP280_data[14]
    if dig_P5 > 32767 :
        dig_P5 -= 65536
    dig_P6 = BMP280_data[17] * 256 + BMP280_data[16]
    if dig_P6 > 32767 :
        dig_P6 -= 65536
    dig_P7 = BMP280_data[19] * 256 + BMP280_data[18]
    if dig_P7 > 32767 :
        dig_P7 -= 65536
    dig_P8 = BMP280_data[21] * 256 + BMP280_data[20]
    if dig_P8 > 32767 :
        dig_P8 -= 65536
    dig_P9 = BMP280_data[23] * 256 + BMP280_data[22]
    if dig_P9 > 32767 :
        dig_P9 -= 65536

    # Select Control measurement register, 0xF4(244), enter normal mode
    bus.write_byte_data(0x77, 0xF4, 0x27)
    # Select Configuration register, 0xF5(245), set stand_by time = 1000 ms
    bus.write_byte_data(0x77, 0xF5, 0xA0)

    time.sleep(0.5)

    # Read data back from 0xF7(247), 8 bytes
    # Temperature xLSB, Humidity MSB, Humidity LSB
    data = bus.read_i2c_block_data(0x77, 0xF7, 8)

    # Convert pressure and temperature data to 19-bits
    adc_p = ((data[0] * 65536) + (data[1] * 256) + (data[2] & 0xF0)) / 16
    adc_t = ((data[3] * 65536) + (data[4] * 256) + (data[5] & 0xF0)) / 16

    # Temperature offset calculations
    var1 = ((adc_t) / 16384.0 - (dig_T1) / 1024.0) * (dig_T2)
    var2 = (((adc_t) / 131072.0 - (dig_T1) / 8192.0) * ((adc_t)/131072.0 - (dig_T1)/8192.0)) * (dig_T3)
    t_fine = (var1 + var2)
    cTemp = (var1 + var2) / 5120.0 #temperature in celcius
    fTemp = cTemp * 1.8 + 32

    # Pressure offset calculations
    var1 = (t_fine / 2.0) - 64000.0
    var2 = var1 * var1 * (dig_P6) / 32768.0
    var2 = var2 + var1 * (dig_P5) * 2.0
    var2 = (var2 / 4.0) + ((dig_P4) * 65536.0)
    var1 = ((dig_P3) * var1 * var1 / 524288.0 + ( dig_P2) * var1) / 524288.0
    var1 = (1.0 + var1 / 32768.0) * (dig_P1)
    p = 1048576.0 - adc_p
    p = (p - (var2 / 4096.0)) * 6250.0 / var1
    var1 = (dig_P9) * p * p / 2147483648.0
    var2 = p * (dig_P8) / 32768.0
    pressure = (p + (var1 + var2 + (dig_P7)) / 16.0) / 100

    return pressure, cTemp

def read_airflow_data():
    airflow_data = bus.read_i2c_block_data(AIRFLOW_ADDRESS, AIRFLOW_CONV_POINTER, 2)
    print(airflow_data)
    airflowvalue = airflow_data[0] * 256 + airflow_data[1]
    if airflowvalue > 32767:
        airflowvalue -= 65535
    airflowvoltage = 0.000125*airflowvalue + 0.62 #Converting to voltage including offset error determined using oscilloscope
    airflow = (-0.3269/0.127) + (math.sqrt((0.254*airflowvalue) - 0.014) / 0.127) #Calculating airflow using equation based on graph from datasheet

    return airflow
