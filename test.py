import time
import math
import smbus
bus = smbus.SMBus(1)

DEVICE_ADDRESS = 0x48 #address of the ADS1115
CONFIG_POINTER = 0x01
CONV_POINTER = 0x00
CONFIG_DATA = [0b10000010, 0b10000011] #all default except change to continuous conversion mode

bus.write_i2c_block_data(DEVICE_ADDRESS, CONFIG_POINTER, CONFIG_DATA) #write the CONFIG_DATA



#while 1:
#    data = bus.read_i2c_block_data(DEVICE_ADDRESS, CONV_POINTER, 2)
#    value = data[0] * 256 + data[1]
#    if value > 32767:
#	value -= 65535
#    voltage = 0.000125*value + 0.62 # scaling factor to convert to actual voltage
#    #ms = -(25/3111111111)*math.sqrt(24888888888000000*voltage-11462666687111111) - 783333325/3111111111
#    print(voltage)
#    time.sleep(0.05)

def read_data():
	data = bus.read_i2c_block_data(DEVICE_ADDRESS, CONV_POINTER, 2)
	value = data[0] * 256 + data[1]
	if value > 32767:
	value -= 65535
	voltage = 0.000125*value + 0.62 # scaling factor to convert to actual voltage
	#ms = -(25/3111111111)*math.sqrt(24888888888000000*voltage-11462666687111111) - 783333325/3111111111
	return voltage
