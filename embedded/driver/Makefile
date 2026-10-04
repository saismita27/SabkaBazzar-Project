obj-m += sabka_help_driver.o
KDIR ?= /lib/modules/$(shell uname -r)/build
MODULE_DIR := $(shell pwd)

.PHONY: all clean
all:
	@test -d "$(KDIR)" || { echo "Missing matching kernel build tree: $(KDIR). Module build remains untested."; exit 1; }
	$(MAKE) -C "$(KDIR)" M="$(MODULE_DIR)" modules

clean:
	@test -d "$(KDIR)"
	$(MAKE) -C "$(KDIR)" M="$(MODULE_DIR)" clean
