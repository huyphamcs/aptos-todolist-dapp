module huy_addr::todolist {
    // Modules and Functions import
    use std::string::String;
    use std::signer::address_of;

    // Error declaration
    /// Invalid timestamp provided - day, month, year, hour, minutes, or seconds are out of valid range
    const EINVALID_TIME_STAMP: u64 = 0;

    // Structs declaration
    public struct Todolist has key {
        tasks: vector<Task>
    }

    struct Task has store, copy, drop {
        content: String,
        isCompleted: bool,
        timestamp: TimeCreate
    }

    struct TimeCreate has store, copy, drop {
        date: Date,
        time_in_day: TimeInDay
    }

    struct Date has store, copy, drop {
        day: u64,
        month: u64,
        year: u64
    }

    struct TimeInDay has store, copy, drop {
        hour: u64,
        mins: u64,
        secs: u64
    }

    // Functions

    // Initial function, called once when deploy the module
    fun init_module(_account: &signer) {
        // Do nothing here
    }

    public entry fun create_list(account: &signer) {
        let empty_todolist = Todolist { tasks: vector<Task>[] };
        move_to(account, empty_todolist);
    }

    

    public entry fun add_task(
        account: &signer,
        content: String,
        day: u64,
        month: u64,
        year: u64,
        hour: u64,
        mins: u64,
        secs: u64
    ) acquires Todolist {
        // Check valid timestamp
        assert!(
            (day > 0 && day <= 31)
                && (month > 0
                    && month <= 12)
                && (year > 0)
                && (hour >= 0
                    && hour <= 24)
                && (mins >= 0
                    && mins <= 60)
                && (secs >= 0
                    && secs <= 60),
            EINVALID_TIME_STAMP
        );

        // Declare new task from valid inputs
        let new_date = Date { day, month, year };
        let new_time = TimeInDay { hour, mins, secs };
        let new_timestamp = TimeCreate { date: new_date, time_in_day: new_time };
        let new_task = Task { content, isCompleted: false, timestamp: new_timestamp };
        let tasks_vector_ref = &mut borrow_global_mut<Todolist>(address_of(account)).tasks;

        // Add this task to the resource
        tasks_vector_ref.push_back(new_task);
    }

    public entry fun mark_as_completed(account: &signer, index: u64) acquires Todolist {
        let single_vector_ref =
            borrow_global_mut<Todolist>(address_of(account)).tasks.borrow_mut(index);
        single_vector_ref.isCompleted = true;
    }

    public entry fun remove_task(account: &signer, index: u64)  acquires Todolist  {
        let tasks_vector_ref = &mut borrow_global_mut<Todolist>(address_of(account)).tasks;
        tasks_vector_ref.remove(index);
    }


    // Getter functions
    // Check if list is created
    #[view]
    public fun todolist_exists(account_addr: address): bool {
        exists<Todolist>(account_addr)
    }



}

